/**
 * 网络计算方法
 */
const ipTool = {
  length: 32,
  default: [8, 16, 24, 0, 0, 0],
  type: ['A', 'B', 'C', 'D', 'E'],
  //据子网主机数量获取子网掩码
  getStringMask: function (mask: string) {
    let result = '';
    const codeLength = mask.length;
    for (let j = 0; j < 4; j++) {
      result = codeLength / 8 > j ? result + '255.' : result + '0.';
    }
    return result.substr(0, result.length - 1);
  },
  //获取主机数量位长
  getCountLength: function (count: number) {
    return count.toString(2).length;
  },
  //将十进制点分法ip转化为十六进制ip
  getHexIp: function (ipStr: string) {
    let result = '',
      temp: any = 0;
    const ips = ipStr.split('.');
    for (let i = ips.length - 1; i >= 0; i--) {
      temp = parseInt(ips[i], 10).toString(16);
      if (temp.length < 2) {
        temp = '0' + temp;
      }
      result += temp;
    }
    return '0x' + result;
  },
  getBinIp: function (ip32Str: string) {
    const ips = ip32Str.split('.');
    let result = '',
      temp;
    for (let i = 0; i < 4; i++) {
      temp = parseInt(ips[i]).toString(2);
      const len = temp.length;
      for (let k = 0; k < 8 - len; k++) {
        temp = '0' + temp;
      }
      result += temp;
    }
    return result;
  },
  //获取网络类型id
  getIpTypeId: function (ipStr: string) {
    const ips = ipStr.split('.') as string[];
    const type = parseInt(ips[0]);
    if (type > 0 && type < 128) {
      return 0;
    }
    if (type < 192) {
      return 1;
    }
    if (type < 224) {
      return 2;
    }
    if (type < 240) {
      return 3;
    }
    if (type < 248) {
      return 4;
    }
    if (type < 252) {
      return 5;
    }
    return -1;
  },
  //获取IP地址类型
  getIpType: function (ip: string) {
    const id = this.getIpTypeId(ip);
    return id === -1 ? 'FULL' : this.type[id];
  },
  //将十六进制人ip地址转化为十进制点分法形式
  getIpFromHex: function (ip32: string) {
    let temp: any = '';
    const ips: number[] = [];
    for (let i = ip32.length - 1; i >= 2; i = i - 2) {
      temp = ip32[i - 1] + '' + ip32[i];
      temp = parseInt(temp, 16);
      ips.push(temp);
    }
    return ips.join('.');
  },
  getIpFromBin: function (ipbin: string) {
    let result = '';
    for (let i = 1; i <= 32; i += 8) {
      result += parseInt(ipbin.substr(i - 1, 8), 2) + '.';
    }
    return result.substr(0, result.length - 1);
  },
  //据主机数确定子网掩码
  getMaskFromCount: function (count: number, radix = 10) {
    const len = this.getCountLength(count);
    let fix = '';
    const store: string[] = [];
    if (!radix || typeof radix !== 'number' || radix < 1) {
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
  },
  //获取十进制的子网掩码序列
  getDecMask: function (count: number) {
    return this.getMaskFromCount(count).join('.');
  },
  //获取十六进制的子网掩码序列
  getHexMask: function (count: number) {
    return '0x' + this.getMaskFromCount(count, 16).join('');
  },
  //获取二进制的子网掩码序列
  getBinMask: function (count: number) {
    return this.getMaskFromCount(count, 2).join('.');
  },
  //获取主机地址
  getAddr: function (ip: string, mask: string) {
    const ips = ip.split('.');
    const masks = mask.split('.');
    const store: number[] = [];
    for (let i = 0; i < 4; i++) {
      store[i] = Number(ips[i]) & Number(masks[i]);
    }
    return store.join('.');
  },
  //获取广播地址
  getBroadcastAddr: function (ip: string, mask: string) {
    const host = this.getAddr(ip, mask);
    const binHost: string[] = this.getBinIp(host).split('');
    const hostLength = this.getHostLength(mask);

    for (let i = 31 - hostLength; i < 32; i++) {
      binHost[i] = '1';
    }
    return this.getIpFromBin(binHost.join(''));
  },
  //获取子网掩码对应ip类型
  getMaskType: function (mask: string) {
    const masks = mask.split('.');
    if (masks[0] !== '255') {
      throw new TypeError('invalid subnetmask');
    }
    let count = 0;
    for (let i = 1; i < 4; i++) {
      if (masks[i] !== '255') {
        break;
      }
      count++;
    }
    return count;
  },
  //获取掩码位长度
  getMaskLength: function (mask: string) {
    return 8 - (this.getHostLength(mask) % 8);
  },
  //获取主机号长度
  getHostLength: function (mask: string) {
    const binMask = this.getBinIp(mask);
    let count = 0;
    for (let i = 0; i < 32; i++) {
      if (binMask[31 - i] !== '0') {
        break;
      }
      count++;
    }
    return count;
  },
  //最大主机数
  getMaxHostCount: function (mask: string) {
    return Math.pow(2, this.getHostLength(mask)) - 2;
  },
  //总共最大主机数
  getMaxTotalHostCount: function (mask: string) {
    return this.getMaxHostCount(mask) & this.getMaxSubnetCount(mask);
  },
  //获取最多子网
  getMaxSubnetCount: function (mask: string) {
    return Math.pow(2, this.getMaskLength(mask)) - 2;
  },
  //取反
  anti: function (code: number, flag: boolean) {
    let result = '';
    if (typeof code === 'string') {
      code = parseInt(code);
    }
    const binCode = parseInt(code.toString(2), 10).toString();
    for (let i = 0; i < binCode.length; i++) {
      result += binCode[i] === '0' ? 1 : 0;
    }
    return flag === true ? result : parseInt(result, 2);
  },
  getUsefulHostScale: function (ip: string, mask: string) {
    return '[' + this.getAddr(ip, mask) + ' - ' + this.getBroadcastAddr(ip, mask) + ']';
  },
};

export default ipTool;
