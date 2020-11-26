import {
  ReportCallback,
  TaskCallback,
  TaskCallbackOptions,
  TaskExecuteResult,
  TaskExecuteResultCode,
  TaskOptions,
  TaskState,
  TaskTimeLine,
  TaskEventMap,
} from './interface';
import TaskProfile from './TaskProfile';
import LocalEvent from './LocalEvent';

export default class Task<T extends Record<string, any> = {}> extends LocalEvent<TaskEventMap> {
  private readonly id: string;
  private state = TaskState.INIT;
  private startTime = 0;
  private endTime = 0;
  private duration = 0;
  private message = '';
  private readonly priority: number;
  private readonly retrievable: boolean;
  private maxRetryTimes = 3;
  private retryTimes = 0;
  private totalDuration = 0;
  private readonly retryPriority: number;
  private timeline: TaskTimeLine<T>[] = [];
  private callbackData: TaskCallbackOptions<T>;
  private readonly callback: TaskCallback<T>;

  constructor(options: TaskOptions<T>) {
    super();
    const { id, callback, priority, retryPriority, retrievable } = options;
    this.id = id;
    this.priority = priority || 0;
    this.retrievable = retrievable || false;
    this.retryPriority = retryPriority || 0;
    this.callback = callback;
    this.callbackData = {
      data: {} as T,
    };
  }

  protected getEventKeys(): string[] {
    return ['report', 'cancel'];
  }

  getTimeline() {
    return this.timeline;
  }

  cancel() {
    if (!this.isExecutable()) {
      return false;
    }
    this.state = TaskState.CANCEL;
    this.fire('cancel', { task: this, profile: this.getProfile() });
    return true;
  }

  execute() {
    if (!this.callback) {
      this.message = 'Execute Empty Task OK';
      return Promise.resolve<TaskExecuteResult>(this._getResult(TaskExecuteResultCode.EMPTY));
    }
    if (this.state === TaskState.SUCCESS) {
      this.message = 'Task Executed Already !!!';
      return Promise.resolve<TaskExecuteResult>(this._getResult(TaskExecuteResultCode.EMPTY));
    }
    if (this.state === TaskState.CANCEL) {
      this.message = 'Task Canceled Already !!!';
      return Promise.resolve<TaskExecuteResult>(this._getResult(TaskExecuteResultCode.EMPTY));
    }
    this._start();
    return this.callback(this.callbackData, this.getContext())
      .then(({ state, message }) => {
        this.message = message;
        if (state) {
          return this.success();
        }
        return this.doNext();
      })
      .catch((e) => {
        this.message = e.message;
        this.doNext();
        throw e;
      });
  }

  private getContext() {
    return {
      report: (args: any) => {
        if (!this.isRunning()) {
          return;
        }
        this.fire('report', args);
      },
    };
  }

  doNext() {
    if (this.retrievable && this.retryTimes < this.maxRetryTimes) {
      this.retryTimes++;
      this.message += '>>>>>> 准备重试 ......';
      return this.retry();
    }
    return this.failed();
  }

  success() {
    this.state = TaskState.SUCCESS;
    this._end();
    return this._getResult(TaskExecuteResultCode.SUCCESS);
  }

  retry() {
    this.state = TaskState.RETRY_PENDING;
    this._end();
    return this._getResult(TaskExecuteResultCode.RETRY_PENDING);
  }

  failed() {
    this.state = TaskState.FAILED;
    this._end();
    return this._getResult(TaskExecuteResultCode.FAILED);
  }

  getState() {
    return this.state;
  }

  getMessage() {
    return this.message;
  }

  getId() {
    return this.id;
  }

  getEndTime() {
    return this.endTime;
  }

  getStartTime() {
    return this.startTime;
  }

  getDuration() {
    return this.duration;
  }

  isSuccess() {
    return this.state === TaskState.SUCCESS;
  }

  isFailed() {
    return this.state === TaskState.FAILED;
  }

  isRunning() {
    return this.state === TaskState.RUNNING;
  }

  isRetrying() {
    return this.state === TaskState.RETRY_PENDING;
  }

  isCancel() {
    return this.state === TaskState.CANCEL;
  }

  isExecutable() {
    return this.state === TaskState.INIT || this.state === TaskState.RETRY_PENDING;
  }

  isRetrievable() {
    return this.retrievable;
  }

  getPriority() {
    return this.priority;
  }

  getRetryPriority() {
    return this.retryPriority;
  }

  getProfile(): string {
    return new TaskProfile(this).toString();
  }

  private _getResult(state: TaskExecuteResultCode): TaskExecuteResult {
    const profile = new TaskProfile(this);
    const result = {
      message: this.message,
      state,
      duration: this.duration,
      startTime: this.startTime,
      endTime: this.endTime,
      profile,
    };
    this.timeline.push({
      id: this.id,
      state,
      duration: this.duration,
      startTime: this.startTime,
      endTime: this.endTime,
      result,
      profile: profile.toString(),
    });
    return result;
  }

  private _start() {
    this.state = TaskState.RUNNING;
    this.startTime = Date.now();
  }

  private _end() {
    this.endTime = Date.now();
    this.duration = this.endTime - this.startTime;
    this.totalDuration += this.duration;
  }

  getTotalDuration() {
    return this.totalDuration;
  }
}
