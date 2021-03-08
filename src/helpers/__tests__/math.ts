import { toAngle, toArc } from '../math';

describe('Math相关函数测试', () => {
  test('角弧度转换', function() {
    expect(toAngle(Math.PI)).toBe(180);
    expect(toArc(180)).toBe(Math.PI);
  });
});
