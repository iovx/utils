import {fixedNum, getPlainObject, guid, pipe} from '../util';

describe('测试Util', () => {
  test('Generate GUID', () => {
    expect(guid()).toBeTruthy();
  });
  test('Pipe Test', () => {
    expect(pipe('100')).toBe('100');
    expect(pipe('100', () => 0)).toBe(0);
    expect(pipe('100', (a: string) => a + 1)).toBe('1001');
    expect((<any>pipe)('100', [])).toBe('100');
    const errorTest = () => (<any>pipe)();
    expect(errorTest).toThrow('the first parameter must be pass in!');
  });
  test('获取单键对象', () => {
    expect(getPlainObject('name', 'wind')).toEqual({name: 'wind'});
  });
  test('数值长度固定', () => {
    expect(fixedNum(12, 8, 'x')).toBe('xxxxxx12');
  });
});
