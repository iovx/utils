import {fixedNum, guid} from "../util";

describe('基础工具', () => {
  test('test util fixNum', () => {
    expect(fixedNum(1, 3)).toBe('001');
  });
  test('guid generate', () => {
    expect(guid().length).toBe(36);
  })
})
;
