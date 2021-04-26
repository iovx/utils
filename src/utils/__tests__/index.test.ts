import { fillWith, pick } from '../';

test('从对象中获取指定key对应值', () => {
  expect(pick({ name: 'wx', age: 22, gender: 1 }, ['name', 'age'])).toEqual({ name: 'wx', age: 22 });
});

test('将字符串数据填充为对象', () => {
  expect(fillWith(['export', 'download'], () => true)).toEqual({ download: true, export: true });
});
