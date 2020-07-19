/**
 * 获取随机的十六进制颜色
 * @return {[string]} [颜色值]
 */
export function getRandHexColor() {
  let result = '#';
  for (let i = 0; i < 6; i++) {
    result += Math.floor(Math.random() * 16).toString(16);
  }
  return result;
}

/**
 * 获取随机的RGB【A】颜色
 * @param alpha [是否随机alpha通道]
 * @returns {string} [含RGB字符串]
 */
export function getRandColor(alpha?: any) {
  if (!alpha && alpha !== 0) {
    alpha = false;
  }
  const result: number[] = [];
  let mode = 'rgb';
  for (let i = 0; i < 3; i++) {
    result.push(Math.floor(Math.random() * 255));
  }
  if (alpha) {
    if (typeof alpha === 'number') {
      alpha = alpha > 1 ? 1 : alpha < 0 ? 0 : alpha;
    } else {
      alpha = Math.random();
    }
    result.push(alpha);
    mode = 'rgba';
  }
  return mode + '(' + result.join(',') + ')';
}

/**
 * 将RGB字符串转为十六进制形式
 * @param  {[string]} rgbStr [rgb字符串]
 * @return {[string]}        [十六进制颜色值]
 */
export function toHex(rgbStr: string) {
  const reg = /((\d(\.\d*)?){1,3},?)/gi;
  let temp = '',
    result = '#';
  let cls = rgbStr.match(reg);
  if (!cls) {
    return false;
  }
  if (cls.length > 4) {
    cls = cls.slice(0, 4);
  }
  const len = cls.length;
  for (let i = 0; i < len; i++) {
    if (i < 3) {
      temp = parseInt(cls[i]).toString(16);
    } else {
      temp = Math.floor(parseFloat(cls[i]) * 255).toString(16);
    }
    if (temp.length < 2) temp = '0' + temp;
    result += temp;
  }
  return result;
}

/**
 * 将十六进制颜色转换为RGB(A)颜色
 * @param hexStr
 * @returns {*}
 */
export function toRGB(hexStr: string) {
  const start = hexStr.indexOf('#');
  let i = 0;
  if (start === 0) {
    i = 1;
  } else if (start !== -1) {
    return false;
  }
  const store: number[] = [];
  for (i; i < hexStr.length - 1; i += 2) {
    store.push(parseInt(hexStr.substr(i, 2), 16));
  }
  let ct = 'rgb';
  if (store.length === 4) {
    const l = store.length - 1;
    store[l] = store[l] / 255;
    ct = 'rgba';
  }
  return ct + '(' + store.join(',') + ')';
}
