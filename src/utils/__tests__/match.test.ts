import {match} from "../match";

test('简单字符模式匹配', () => {
  expect(match('/api/task/**', '/api/task/user')).toBeTruthy();
  expect(match('/api/task/**', '/api/task/user')).toBeTruthy();
  expect(match('/api/task/*', '/api/task/user/info')).toBeFalsy();
  expect(match('/api/task/*', '/api/task/user')).toBeTruthy();
});
