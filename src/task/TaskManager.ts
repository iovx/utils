import LocalEvent from './LocalEvent';
import Task from './Task';
import {
  RetryLevel,
  TaskCompleteCallback,
  TaskFailedCallback,
  TaskLoadCallback,
  TaskManagerEventMap,
  TaskManagerOptions,
  TaskManagerState,
  TaskOptions,
  TaskSuccessCallback,
} from './interface';

export default class TaskManager extends LocalEvent<TaskManagerEventMap> {
  private queue: Task[] = [];
  private limit = 3;
  private runningCount = 0;
  private state: TaskManagerState = TaskManagerState.INIT;
  private startTime = 0;
  private endTime = 0;
  private retryLevel: RetryLevel = RetryLevel.RETRY_FIRST;
  private duration = 0;
  private activeQueueMap: Record<string, { flag: boolean; task: Task }> = {};
  private waitLoadCallback: TaskLoadCallback[] = [];
  private waitFailedCallback: TaskFailedCallback[] = [];
  private waitSuccessCallback: TaskSuccessCallback[] = [];
  private waitPausedCallback: { type: number; callback: (result: boolean) => void }[] = [];
  private waitCompleteCallback: TaskCompleteCallback[] = [];
  private subscribeReportCallback: Function[] = [];

  private constructor(options?: TaskManagerOptions) {
    super();
    Object.assign(this, options);
  }

  static new(options?: TaskManagerOptions) {
    return new TaskManager(options);
  }

  static newTask<T extends Record<string, any> = {}>(options: TaskOptions<T>) {
    return new Task(options);
  }

  getTask(i: number) {
    return this.queue[i] || null;
  }

  getTaskById(id: string) {
    return this.queue.find((i) => i.getId() === id);
  }

  getTasks() {
    return this.queue;
  }

  do(callback: (this: TaskManager) => void) {
    if (callback) {
      callback.call(this);
    }
    return this;
  }

  clearCallback() {
    this.waitLoadCallback = [];
    this.waitFailedCallback = [];
    this.waitSuccessCallback = [];
    this.waitPausedCallback = [];
    this.waitCompleteCallback = [];
    return this;
  }

  register(task: Task | Task[]) {
    if (Array.isArray(task)) {
      task.forEach((t) => this.register(t));
      return this;
    }
    task.on('report', (args) => {
      this.fire('report', { task, data: args });
    });
    task.on('cancel', (args) => {
      this.fire('cancel', { task, data: args });
    });
    this.queue.push(task);
    return this;
  }

  clean() {
    this.queue = this.queue.filter((i) => !i.isSuccess());
    return this;
  }

  setLimit(limit: number) {
    if (this.state === TaskManagerState.BUSY) {
      return false;
    }
    this.limit = limit;
    return true;
  }

  pause(): Promise<boolean>;
  pause(callback: (result: boolean) => void): this;
  pause(callback?: (result: boolean) => void) {
    if (this.state === TaskManagerState.PAUSED) {
      if (callback) {
        return this;
      }
      return Promise.resolve<boolean>(false);
    }
    if (this.state !== TaskManagerState.PAUSED_PENDING) {
      this.state = TaskManagerState.PAUSED_PENDING;
    }
    if (callback) {
      this.waitPausedCallback.push({
        type: 1,
        callback,
      });
      return this;
    }
    return new Promise((resolve) => {
      this.waitPausedCallback.push({
        type: 0,
        callback: resolve,
      });
    });
  }

  complete(callback: TaskCompleteCallback) {
    this.waitCompleteCallback.push(callback);
    return this;
  }

  load(callback: TaskLoadCallback) {
    this.waitLoadCallback.push(callback);
    return this;
  }

  success(callback: TaskSuccessCallback) {
    this.waitSuccessCallback.push(callback);
    return this;
  }

  failed(callback: TaskFailedCallback) {
    this.waitFailedCallback.push(callback);
    return this;
  }

  private next() {
    return [...this.queue]
      .sort((a, b) => {
        const pa = a.getPriority();
        const pb = b.getPriority();
        const rpa = a.getRetryPriority();
        const rpb = b.getRetryPriority();
        if (a.isRetrying()) {
          if (b.isRetrying()) {
            return rpb - rpa ? pb - pa : -1;
          }
          if (this.retryLevel === RetryLevel.RETRY_FIRST) {
            return -1;
          }
          if (this.retryLevel === RetryLevel.NORMAL_FIRST) {
            return 1;
          }
          return 1;
        }
        if (b.isRetrying()) {
          if (this.retryLevel === RetryLevel.RETRY_FIRST) {
            return 1;
          }
          if (this.retryLevel === RetryLevel.NORMAL_FIRST) {
            return -1;
          }
          return -1;
        }
        return pb - pa;
      })
      .find((i) => i.isExecutable());
  }

  private shouldExecuteNext() {
    if (this.state === TaskManagerState.PAUSED || this.state === TaskManagerState.PAUSED_PENDING) {
      return false;
    }
    if (this.runningCount >= this.limit) {
      return false;
    }
    return this.queue.some((i) => i.isExecutable());
  }

  private doComplete() {
    if (this.state === TaskManagerState.BUSY) {
      this.state = TaskManagerState.IDLE;
      this.endTime = Date.now();
      this.duration = this.endTime - this.startTime;
      this.fire('complete', this.getStatus());
      this.waitCompleteCallback.forEach((i) => i(this.getStatus()));
      return;
    }
    if (this.state === TaskManagerState.PAUSED_PENDING) {
      this.state = TaskManagerState.PAUSED;
      this.waitPausedCallback.forEach((i) => {
        i.callback(true);
      });
      this.waitPausedCallback = this.waitPausedCallback.filter((i) => i.type === 1);
      this.fire('pause', {});
    }
  }

  getActiveQueue() {
    return Object.entries(this.activeQueueMap)
      .filter(([_, v]) => v.flag)
      .map(([k]) => k);
  }

  getStatus() {
    const success = this.queue.filter((i) => i.isSuccess()).length;
    return {
      success,
      failed: this.queue.filter((i) => i.isFailed()).length,
      cancel: this.queue.filter((i) => i.isCancel()).length,
      retry: this.queue.filter((i) => i.isRetrying()).length,
      active: this.runningCount,
      activeId: this.getActiveQueue(),
      total: this.queue.length,
      ok: this.queue.length === success,
      duration: this.duration,
    };
  }

  empty() {
    this.queue = [];
    this.activeQueueMap = {};
  }

  reset() {
    this.empty();
    this.state = TaskManagerState.INIT;
  }

  private execute() {
    if (!this.shouldExecuteNext()) {
      return this;
    }
    const nextTask = this.next();
    if (!nextTask) {
      return this;
    }
    if (this.state !== TaskManagerState.BUSY) {
      this.state = TaskManagerState.BUSY;
    }
    this.activeQueueMap[nextTask.getId()] = {
      task: nextTask,
      flag: true,
    };
    this.runningCount++;
    const loadParams = { task: nextTask };
    this.waitLoadCallback.forEach((i) => i(loadParams));
    this.fire('load', loadParams);
    nextTask
      .execute()
      .then((res) => {
        this.activeQueueMap[nextTask.getId()].flag = false;
        this.runningCount--;
        this.duration = Date.now() - this.startTime;
        const successParams = { task: nextTask, data: res, profile: nextTask.getProfile() };
        this.waitSuccessCallback.forEach((i) => i(successParams));
        this.fire('success', successParams);
        this.execute();
        if (this.runningCount <= 0) {
          this.doComplete();
        }
      })
      .catch((e) => {
        this.runningCount--;
        this.activeQueueMap[nextTask.getId()].flag = false;
        this.duration = Date.now() - this.startTime;
        const failedParams = { task: nextTask, error: e, message: nextTask.getProfile() };
        this.waitFailedCallback.forEach((i) => i(failedParams));
        this.fireAsObject('failed', failedParams);
        if (this.runningCount <= 0) {
          this.doComplete();
        }
      });
    return this;
  }

  start() {
    if (this.state === TaskManagerState.INIT || this.state === TaskManagerState.IDLE) {
      this.startTime = Date.now();
    } else {
      this.state = TaskManagerState.RESTART;
    }

    while (this.shouldExecuteNext()) {
      this.execute();
    }
    return this;
  }

  protected getEventKeys(): string[] {
    return ['complete', 'pause', 'success', 'failed', 'load', 'report', 'cancel'];
  }

  isPaused() {
    return this.state === TaskManagerState.PAUSED;
  }
}
