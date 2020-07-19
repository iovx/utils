import TaskExecutor, {ITaskPlugin} from '../TaskExecutor';


describe('串/并行任务执行测试', () => {
  let result = -1;
  let resultParallel = -1;
  const plugins: ITaskPlugin[] = [
    {
      name: '同步任务',
      skip: false,
      task: () => (done) => {
        console.log('执行同步任务 1');
        result = 1;
        resultParallel = 1;
        done();
      },
    },
    {
      name: '异步任务二',
      skip: false,
      task: () => (done) => {
        setTimeout(() => {
          console.log('执行异步任务 2');
          result = 2;
          resultParallel = 2;
          done();
        }, 2000);
      },
    },
    {
      name: '异步任务三',
      skip: false,
      task: () => (done) => {
        setTimeout(() => {
          console.log('执行异步任务 3');
          result = 3;
          resultParallel = 3;
          done();
        }, 1500);
      },
    },
    {
      name: '同步任务四',
      skip: false,
      task: () => (done) => {
        console.log('执行同步任务 4');
        done();
      },
    },
  ];
  const taskExecutor = TaskExecutor.new({
    plugins,
  });
  test('异步任务执行测试', (done) => {
    taskExecutor.series().then(() => {
      expect(result).toBe(3);
      done();
    });
  });
  test('异步任务执行测试', (done) => {
    taskExecutor.parallel().then(() => {
      expect(resultParallel).toBe(1);
      done();
    });
  });
});
