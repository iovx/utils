/**
 * 将字符串IP转成16进制形式
 * @param  {[string]} ipStr [ip字符串]
 * @return {[string]}       [十六进制ip值]
 */
export function hexIp(ipStr: string) {
  let result = '',
    temp = '';
  const ips = ipStr.split('.');
  for (let i = ips.length - 1; i >= 0; i--) {
    temp = parseInt(ips[i], 10).toString(16);
    if (temp.length < 2) temp = '0' + temp;
    result += temp;
  }
  return '0x' + result;
}

/**
 * 将16进制ip转为字符形式
 * @param  {[string]} ip16 [十六进制ip]
 * @return {[string]}      [ip字符串]
 */
export function getIPAddress(ip16: string) {
  let temp: any = 0;
  const ips: number[] = [];

  for (let i = ip16.length - 1; i >= 2; i = i - 2) {
    temp = ip16[i - 1] + '' + ip16[i];
    temp = parseInt(temp, 16);
    ips.push(temp);
  }
  return ips.join('.');
}

/**
 * 获取主机地址
 * @param ip
 * @param mask
 * @returns {string}
 */
export function getAddress(ip: string, mask: string) {
  const ips = ip.split('.');
  const masks = mask.split('.');
  const store: number[] = [];
  for (let i = 0; i < 4; i++) {
    store[i] = Number(ips[i]) & Number(masks[i]);
  }
  return store.join('.');
}

/**
 * 将32位ip点串转换为二进制ip
 * @param ip32Str
 * @returns {string}
 */
export function getBinIp(ip32Str: string) {
  const ips = ip32Str.split('.');
  let result = '';
  let temp: string;
  for (let i = 0; i < 4; i++) {
    temp = parseInt(ips[i]).toString(2);
    const len = temp.length;
    for (let k = 0; k < 8 - len; k++) {
      temp = '0' + temp;
    }
    result += temp;
  }
  return result;
}

/**
 * 获取主机号长度
 * @param mask
 * @returns {number}
 */
export function getHostLength(mask: string) {
  const binMask = getBinIp(mask);
  let count = 0;
  for (let i = 0; i < 32; i++) {
    if (binMask[31 - i] !== '0') {
      break;
    }
    count++;
  }
  return count;
}

/**
 * 获取掩码位长度
 * @param mask
 * @returns {number}
 */
function getMaskLength(mask: string) {
  return 8 - (getHostLength(mask) % 8);
}

/**
 * 二进制ip串转换为32位ip串
 * @param ipBin
 * @returns {string}
 */
export function getIpFromBin(ipBin: string) {
  let result = '';
  for (let i = 1; i <= 32; i += 8) {
    result += parseInt(ipBin.substr(i - 1, 8), 2) + '.';
  }
  return result.substr(0, result.length - 1);
}

/**
 * 获取广播地址
 * @param {string} ip
 * @param {string} mask
 * @returns {string}
 */
export function getBroadcastAddress(ip: string, mask: string) {
  const host = getAddress(ip, mask);
  const binHost = getBinIp(host).split('');
  const hostLength = getHostLength(mask);
  for (let i = 31 - hostLength; i < 32; i++) {
    binHost[i] = '1';
  }
  const res = binHost.join('');
  return getIpFromBin(res);
}

/**
 * 获取IP地址类型
 * @param {string} ipStr
 * @returns {string}
 */
export function getIpType(ipStr: string) {
  const ips = ipStr.split('.');
  let id;
  const types = ['A', 'B', 'C', 'D', 'E'];
  const type = parseInt(ips[0]);
  if (type > 0 && type < 128) {
    id = 0;
  } else if (type < 192) {
    id = 1;
  } else if (type < 224) {
    id = 2;
  } else if (type < 240) {
    id = 3;
  } else if (type < 248) {
    id = 4;
  } else if (type < 252) {
    id = 5;
  } else {
    id = -1;
  }
  return id === -1 ? 'FULL' : types[id];
}

/**
 * 据主机数确定子网掩码
 * @param {number} count
 * @param {number} radix
 * @returns {string[]}
 */
export function getMaskFromCount(count: number, radix = 10) {
  const len = count.toString(2).length;
  let fix = '';
  const store: string[] = [];
  if (!radix || radix < 1) {
    radix = 10;
  }
  for (let i = 1; i <= 32; i++) {
    if (i < 32 - len) {
      fix += 1;
    } else {
      fix += 0;
    }
    if (i % 8 === 0) {
      store.push(parseInt(fix, 2).toString(radix));
      fix = '';
    }
  }
  return store;
}

/**
 * 获取十进制的子网掩码序列
 * @param count
 * @returns {string}
 */
export function getDecMask(count: number) {
  return getMaskFromCount(count).join('.');
}

/**
 * 获取十六进制的子网掩码序列
 * @param count
 * @returns {string}
 */
export function getHexMask(count: number) {
  return (
    '0x' +
    getMaskFromCount(count, 16)
      .map((item) => '0'.repeat(2 - item.length) + item)
      .join('')
  );
}

/**
 * 获取二进制的子网掩码序列
 * @param count
 * @returns {string}
 */
export function getBinMask(count: number) {
  return getMaskFromCount(count, 2)
    .map((item) => '0'.repeat(8 - item.length) + item)
    .join('.');
}

export function getUsefulHostScale(ip: string, mask: string) {
  return '[' + getAddress(ip, mask) + ' - ' + getBroadcastAddress(ip, mask) + ']';
}

/**
 * 最大主机数
 * @param {string} mask
 * @returns {number}
 */
export function getMaxHostCount(mask: string) {
  return Math.pow(2, getHostLength(mask)) - 2;
}

/**
 * 获取最多子网
 * @param {string} mask
 * @returns {number}
 */
function getMaxSubnetCount(mask: string) {
  return Math.pow(2, getMaskLength(mask)) - 2;
}

/**
 * 总共最大主机数
 * @param {string} mask
 * @returns {number}
 */
export function getMaxTotalHostCount(mask: string) {
  return getMaxHostCount(mask) & getMaxSubnetCount(mask);
}
