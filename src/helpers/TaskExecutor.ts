export type ITask = (context: any) => ((done: Function) => void);

export interface ITaskPlugin {
  task: ITask;
  name: string;
  skip: boolean;
}

export interface TaskExecutorOptions {
  plugins: ITaskPlugin[];
}

export default class TaskExecutor {
  private plugins: ITaskPlugin[];

  static new(options: TaskExecutorOptions) {
    return new TaskExecutor(options);
  }

  constructor(options: TaskExecutorOptions) {
    const {plugins} = options;
    this.register(plugins);
  }

  getContext() {

  }

  register(plugins: ITaskPlugin[]) {
    this.plugins = plugins;
    return this;
  }

  series() {
    return new Promise((resolve) => {
      series(this.plugins, this.getContext(), resolve);
    });
  }

  parallel() {
    return new Promise((resolve) => {
      parallel(this.plugins, this.getContext(), resolve);
    })
  }

}

// parallel(plugins);
export function parallel<T=any>(plugins: ITaskPlugin[], context: T, callback?: Function) {
  const stateArr = new Array(plugins.length).fill(0);
  plugins.forEach((plugin, i) => {
    plugin.task(gc(context, i))(() => {
      stateArr[i] = true;
    });
  });
  if (callback) {
    callback();
  }
}

// apply plugin
function gc(context: any, i: number) {
  return {
    ...context,
    getIndex: () => i,
  };
}

export function series<T=any>(plugins: ITaskPlugin[], context: T, callback?: Function) {
  const stateArr = new Array(plugins.length).fill(0);
  let i = 0;

  function loop(plg: ITaskPlugin) {
    if (!plg) {
      // console.log('exec ok');
      callback && callback();
      return;
    }
    const next = () => {
      stateArr[i] = true;
      i++;
      loop(plugins[i]);
    };
    if (plg.skip) {
      // console.log('Async plugins[' + i + ']', plugins[i].name, plugins.length);
      plg.task(gc(context, i))(() => {
      });
      next();
    } else {
      // console.log('Sync plugins[' + i + ']', plugins[i].name, plugins.length);
      plg.task(gc(context, i))(next);
    }
  }

  loop(plugins[i]);
}