import TaskManager, {RetryLevel, TaskResult} from '../';
import {toPercent} from '../utils';

export function runTask(id: string, timeout = 3000, success = true) {
  return new Promise<TaskResult>((resolve, reject) => {
    setTimeout(() => {
      if (success) {
        resolve({
          state: true,
          error: null,
          message: '执行成功#' + id,
        });
      } else {
        reject(new Error('执行失败#' + id));
        // resolve({
        //   state: false,
        //   message: '执行失败#' + id,
        // });
      }
    }, timeout);
  }).catch(e => {
    throw e;
  });
}

export function createTask(id: string, timeout = 3000, priority = 0, success = true, retrievable = false) {
  return TaskManager.newTask({id, callback: () => runTask(id, timeout, success), priority, retrievable});
}

TaskManager.new({
  limit: 4,
  retryLevel: RetryLevel.NORMAL_FIRST,
})
  .do(function () {
    console.log('==================BEGIN==================');
  })
  .on('load', e => {
    const task = e.target.task;
    console.log('Execute Task：' + task.getId() + ' 级别:' + task.getPriority());
  })
  .on('failed', e => {
    console.log(e.target.message);
  })
  .on('complete', e => {
    const {success, failed, total, duration, cancel} = e.target;
    console.log('===============================================');
    console.log('成功：%s 失败：%s 撤消：%s 共计：%s 耗时：%sms', success, failed, cancel, total, duration);
  })
  .on('pause', e => {
    console.log('==================完成暂停==================');
  })
  .on('success', e => {
    const {data} = e.target;
    console.log(data.profile.toString());
  })
  .on('report', e => {
    console.log(e.target.task.getId() + '->Report', JSON.stringify(e.target.data.data));
  })
  .register([
    createTask('0', 1000),
    createTask('1', 5000),
    TaskManager.newTask<{ t: number }>({
      id: '2',
      retrievable: true,
      priority: 10,
      callback(options, context): Promise<TaskResult> {
        if (!options.data.t) {
          options.data.t = 0;
        }
        let timer: any = 0;
        return new Promise<TaskResult>(resolve => {
          if (options.data.t < 2) {
            setTimeout(() => {
              options.data.t++;
              resolve({
                state: false,
                error: null,
                message: '执行失败#3',
              });
            }, 3000);
          } else {
            const total = 100;
            let current = 0;
            timer = global.setInterval(() => {
              const next = Math.floor(Math.random() * 5);
              current += next;
              current = Math.min(100, current);
              if (current >= 100) {
                clearInterval(timer);
                resolve({
                  state: true,
                  error: null,
                  message: '执行成功#3',
                });
              }
              context.report({
                current,
                total,
                percent: toPercent(current / total),
              });
            }, 1000);
            // setTimeout(() => {
            //   clearInterval(timer);
            //   resolve({
            //     state: true,
            //     error: null,
            //     message: '执行成功#3',
            //   });
            // }, 5000);
          }
        }).catch(e => {
          clearInterval(timer);
          throw e;
        });
      },
    }),
    createTask('3', 2000, 4),
    createTask('4', 4000),
    createTask('5', 1000, 4, false),
    createTask('6', 5000),
    createTask('7', 1000),
    createTask('8', 5000),
    createTask('9', 1000),
  ])
  .do(function () {
    console.log('cancel:', this.getTask(3)?.cancel());
  })
  .do(function () {
    setTimeout(() => {
      console.log('准备暂停 >>>>>>>>>>>>>>>>>>>>>>>>>');
      this.pause().then(() => {
        console.log('暂停成功 =======================');
      }).then(() => {
        setTimeout(() => {
          this.start();
        }, 4000);
      });
    }, 4000);
  })
  .start()
  .pause(() => {
    console.log('==================完成暂停==================');
  })
  .complete(() => {
    console.log('======================END======================');
  });


