/**
 * 判断值是否是对象
 * @param obj
 */
export function isObj(obj: unknown): obj is {} {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

export function isUndefined(o: unknown): o is undefined {
  return typeof o === 'undefined';
}

export function isStr(o: unknown): o is string {
  return typeof o === 'string';
}

export function isArr(o: unknown): o is any[] {
  return Array.isArray(o);
}

export function isEmpty(o: unknown) {
  return isUndefined(o) || (isStr(o) && o === '');
}

export function filterEmptyKey<T extends Record<string, any>>(o: T, excludeKeys: (keyof T)[] = []) {
  Object.keys(o).forEach(i => {
    if (isEmpty(o[i]) || excludeKeys.includes(i)) {
      delete o[i];
    }
  });
  return o;
}

export function isPlainArrayEqual<T extends keyof any>(arr1: T[], arr2: T[]) {
  return arr1.sort().join('') === arr2.sort().join('');
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function noop(..._args: any[]) {
}

/**
 * 将列表转换为指定键的 Map
 * @param list
 * @param key
 * @returns {{}}
 */
export function listToMap<T extends Record<string, any>>(list: T[], key: keyof T) {
  const result: Record<string, any> = {};
  list.forEach(item => {
    const itemKey = item[key];
    if (typeof itemKey !== 'undefined' && itemKey !== '' && item !== null) {
      result[itemKey] = item;
    }
  });
  return result;
}

export function copy(o: any) {
  return JSON.parse(JSON.stringify(o));
}

/**
 * 获取对象指定键值对
 * @param obj
 * @param keys
 */
export function pick<T extends object>(obj: T, keys: (keyof T)[]) {
  return keys.reduce<Partial<T>>(
    (acc, c) => ({
      ...acc,
      [c]: obj[c],
    }),
    ({} as unknown) as T
  );
}

/**
 * 将字符串数据转换为对象
 * @param keys
 * @param callback
 */
export function fillWith<T = any>(keys: string[], callback: (key: string) => T) {
  return keys.reduce<Record<string, T>>(
    (acc, c) => ({
      ...acc,
      [c]: callback(c),
    }),
    {}
  );
}

export function concat(...segments: string[]) {
  return segments.filter(Boolean).join('/').replace(/\/+/g, '/').replace(/.+\/$/, '');
}
