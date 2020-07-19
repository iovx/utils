import { getRandColor, getRandHexColor, toHex, toRGB } from '../color';


describe('颜色相关函数测试', () => {
  test('测试RGB转换HEX', () => {
    expect(toRGB('#ffffff')).toBe('rgb(255,255,255)');
    expect(toRGB('ffffff')).toBe('rgb(255,255,255)');
    expect(toRGB('ff#ffff')).toBeFalsy();
    expect(toRGB('#ffffffff')).toBe('rgba(255,255,255,1)');
  });

  test('测试HEX转换RGB', () => {
    expect(toHex('rgb(255,255,255)')).toBe('#ffffff');
    expect(toHex('rgb(255,8,255)')).toBe('#ff08ff');
    expect(toHex('rgba(255,8,255,0.1)')).toBe('#ff08ff19');
    expect(toHex('rgba(255,8,255,0.1,22)')).toBe('#ff08ff19');
    expect(toHex('')).toBeFalsy();
  });

  test('测试随机颜色产生', () => {
    expect(getRandColor()).toMatch(/rgb\((\d{0,3},?){3}\)/);
    expect(getRandHexColor()).toMatch(/^#[\da-f]{6}$/i);
    expect(getRandColor(1)).toMatch(/^rgba\((\d{0,3},){3}[\d\.]*\)$/i);
    expect(getRandColor(100)).toMatch(/^rgba\((\d{0,3},){3}[\d\.]*\)$/i);
    expect(getRandColor(-100)).toMatch(/^rgba\((\d{0,3},){3}[\d\.]*\)$/i);
    expect(getRandColor(true)).toMatch(/^rgba\((\d{0,3},){3}[\d\.]*\)$/i);
    expect(getRandColor(null)).toMatch(/^rgb\((\d{0,3},){2}\d{0,3}\)$/i);
    expect(getRandColor('null')).toMatch(/^rgba\((\d{0,3},){3}[\d\.]*\)$/i);
  });
});
