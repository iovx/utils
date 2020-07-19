import { MapType } from './interface';

/**
 * 固定长度
 * @param {number} x  输入值
 * @param {number} l 长度
 * @param {string} fillStr 填充字符
 * @returns {string}
 */
export function fixedNum(x: number, l: number, fillStr = '0') {
  for (let i = 1; i <= l; i++) {
    const limit = Math.pow(10, i);
    if (x < limit) {
      return fillStr.repeat(l - i) + x;
    }
  }
  return x.toString();
}

/**
 * 生成uuid
 * return {string}
 */
export function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * 获取一个单键值对象
 * @param {string} key
 * @param value
 * @returns {MapType<any>}
 */
export function getPlainObject(key: string, value: any) {
  const o: MapType<any> = {};
  o[key] = value;
  return o;
}

/**
 * 管道处理
 * @param res
 * @param cb
 */
export function pipe(res: any, ...cb: Function[]): any {
  if (!arguments.length) {
    throw new Error('the first parameter must be pass in!');
  }
  if (!cb.length) {
    return res;
  }
  let next: Function | null = null;
  let isFunc = false;
  while (cb.length) {
    isFunc = false;
    next = cb.shift() as Function;
    if (typeof next === 'function') {
      isFunc = true;
      break;
    }
  }
  return pipe(isFunc ? (next as Function)(res) : res, ...cb);
}
