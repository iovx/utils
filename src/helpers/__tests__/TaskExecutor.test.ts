import TaskExecutor, {ITaskPlugin} from '../TaskExecutor';


describe('串/并行任务执行测试', () => {
  let result = -1;
  let resultParallel = -1;
  const plugins: ITaskPlugin[] = [
    {
      name: '同步任务',
      skip: false,
      task: () => (done) => {
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
