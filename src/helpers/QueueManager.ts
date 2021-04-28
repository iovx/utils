export enum SeriesTaskState {
  INIT,
  RUNNING,
  CANCEL,
  SUCCESS,
  FAILED,
  ERROR,
}

interface SeriesTaskDoneOptions<T = any> {
  (data?: any): T;
}

interface SeriesTaskDone<T = any> {
  (options: SeriesTaskDoneOptions<T>): void;
}

interface SeriesTask<T = any> {
  state: SeriesTaskState;
  key: string;

  callback(done: SeriesTaskDone<T>): void;
}

enum QueueState {
  IDLE,
  RUNNING,
}

export default class QueueManager {
  public static QueueState = QueueState;

  public static series(data: SeriesTask[], done?: Function) {
    function loop() {
      // 过滤状态为 INIT
      // const dataList = data.filter(i => i.state === SeriesTaskState.INIT);
      // if (!dataList.length) {
      //   done && done({ data });
      //   return;
      // }
      // 标记为 running
      const task = data.shift();
      if (!task) {
        done && done({ data });
        return;
      }
      task.state = SeriesTaskState.RUNNING;
      // data.length = 0;
      // console.log('清空队列。。。');
      task.callback((resolve) => {
        try {
          if (task.state === SeriesTaskState.RUNNING) {
            task.state = SeriesTaskState.SUCCESS;
            // loop();
            // return;
          }
          resolve && resolve();
          loop();
        } catch (e) {
          resolve && resolve(e);
        }

        // if (task.state === SeriesTaskState.CANCEL) {
        // rollback
        // loop();
        // }
        // 从队列中移除
        // const index = data.findIndex(i => i.key === dataList[0].key);
        // data.splice(index, 1);
      });
    }

    return loop();
  }

  private queue: SeriesTask[] = [];
  private isRunning = false;
  private timer: any;

  public run() {
    if (this.isRunning) {
      return;
    }
    this.isRunning = true;
    return QueueManager.series(this.queue, () => {
      this.isRunning = false;
    });
  }

  public size() {
    return this.queue.length;
  }

  public getState() {
    return this.isRunning ? QueueState.RUNNING : QueueState.IDLE;
  }

  add(task: Omit<SeriesTask, 'state'>) {
    const localTask = this.queue.find((i) => i.key === task.key);
    if (localTask) {
      if (localTask.state === SeriesTaskState.RUNNING) {
        // 停止任务，跳出，执行最后一个任务，清空队列
        localTask.state = SeriesTaskState.CANCEL;
      }
    }
    this.queue.push({
      ...task,
      state: SeriesTaskState.INIT,
    });
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.run();
    }, 0);
  }

  addAsync(task: Omit<SeriesTask, 'state' | 'callback'> & { callback: () => Promise<any> }) {
    return new Promise((resolve) => {
      this.add({
        ...task,
        callback: (done: SeriesTaskDone) => {
          return task
            .callback()
            .then((data) => {
              done(() => resolve(data));
            })
            .catch((e) => {
              done(() => resolve(e));
            });
        },
      });
    });
  }
}
