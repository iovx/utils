import QueueManager from "../QueueManager";
import {sleep} from "../../utils";

test('Queue Task Execution', async () => {

  const queueManager = new QueueManager();
  [
    {
      key: '打开React-Page',
      callback: async () => {
        await sleep(100);
        return '任务A执行完成';
      },
    },
    {
      key: '打开Html-Page',
      callback: async () => {
        await sleep(100);
        return '任务B执行完成';
      },
    },
  ].forEach((i) => {
    queueManager.addAsync(i);
  });
  expect(queueManager.getState()).toBe(QueueManager.QueueState.IDLE);
  expect(queueManager.size()).toBe(2);
  queueManager.run();
  expect(queueManager.getState()).toBe(QueueManager.QueueState.RUNNING);
  const dd = await queueManager.addAsync({
    key: '打开React-Page3',
    callback: async () => {
      await sleep(100);
      return '任务D执行完成';
    },
  });
  expect(queueManager.size()).toBe(0);
  expect(dd).toBe('任务D执行完成');
  const dd2 = await queueManager.addAsync({
    key: '打开React-Page4',
    callback: async () => {
      await sleep(100);
      return '任务E执行完成';
    },
  });
  expect(dd2).toBe('任务E执行完成');
  expect(queueManager.size()).toBe(0);
  expect(queueManager.getState()).toBe(QueueManager.QueueState.IDLE);
})
