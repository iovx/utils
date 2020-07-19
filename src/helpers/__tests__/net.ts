import {
  getBinMask,
  getBroadcastAddress, getDecMask, getHexMask,
  getIPAddress,
  getIpType,
  getMaxTotalHostCount,
  getUsefulHostScale,
  hexIp,
} from '../ip';

describe('网络相关函数测试', () => {

  test('测试IP转换为十六进制', () => {
    expect(hexIp('192.168.31.217')).toBe('0xd91fa8c0');
    expect(hexIp('192.168.8.217')).toBe('0xd908a8c0');
  });

  test('测试IP转换为字符串', () => {
    expect(getIPAddress('0xd91fa8c0')).toBe('192.168.31.217');
  });

  test('获取广播地址', () => {
    expect(getBroadcastAddress('192.168.8.217', '255.255.255.0')).toBe('192.168.9.255');
    expect(getIpType('192.168.8.217')).toBe('C');
    expect(getIpType('192.168.8.217')).toBe('C');
  });
  test('计算主机数量', () => {
    expect(getMaxTotalHostCount('255.255.255.0')).toBe(254);
  });
  test('主机数量确定子网掩码', () => {
    expect(getDecMask(100)).toBe('255.255.255.0');
    expect(getHexMask(100)).toBe('0xffffff00');
    expect(getBinMask(100)).toBe('11111111.11111111.11111111.00000000');
  });
  test('可用IP', () => {
    expect(getUsefulHostScale('192.168.8.217', '255.255.255.0')).toBe('[192.168.8.0 - 192.168.9.255]');
  });
});
