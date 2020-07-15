export type ITask = (context: any) => ((done: Function) => void);

export interface ITaskPlugin {
  task: ITask;
  name: string;
  skip: boolean;
}

interface TaskExecutorOptions {
  plugins: ITaskPlugin[];
}

export default class TaskExecutor {
  private plugins: ITaskPlugin[];

  constructor(options: TaskExecutorOptions) {
    const { plugins } = options;
    this.register(plugins);
  }

  register(plugins: ITaskPlugin[]) {
    this.plugins = plugins;
    return this;
  }

  series() {
    return new Promise((resolve) => {
      series(this.plugins, resolve);
    });
  }

}

function series(plugins: ITaskPlugin[], callback?: Function) {
  const stateArr = new Array(plugins.length).fill(0);
  let i = 0;

  function loop(plg: ITaskPlugin) {
    if (!plg) {
      console.log('exec ok');
      callback && callback();
      return;
    }
    const next = () => {
      stateArr[i] = true;
      i++;
      loop(plugins[i]);
    };
    if (plg.skip) {
      console.log('Async plugins[' + i + ']', plugins[i].name, plugins.length);
      plg.task(i)(() => {
      });
      next();
    } else {
      console.log('Sync plugins[' + i + ']', plugins[i].name, plugins.length);
      plg.task(i)(next);
    }
  }

  loop(plugins[i]);
}