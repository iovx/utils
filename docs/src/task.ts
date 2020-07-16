import {ITaskPlugin} from '@iovx/utils/helpers/TaskExecutor';

const plugins: ITaskPlugin[] = [
  {
    name: '',
    skip: false,
    task: (context) => (done) => {
      setTimeout(() => {
        console.log('执行任务1:', context.getIndex());
        done();
      }, 3000);
    }
  },
  {
    name: '',
    skip: false,
    task: (context) => (done) => {
      setTimeout(() => {
        console.log('执行任务2:', context.getIndex());
        done();
      }, 1000);
    }
  },
  {
    name: '',
    skip: false,
    task: (context) => (done) => {
      console.log('执行任务3:', context.getIndex());
      done();
    }
  },
  {
    name: '',
    skip: false,
    task: (context) => (done) => {
      setTimeout(() => {
        console.log('执行任务4:', context.getIndex());
        done();
      }, 1000);
    }
  },
];

export {plugins}

