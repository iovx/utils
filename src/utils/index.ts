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
  Object.keys(o).forEach((i) => {
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
export function noop(..._args: any[]) {}

/**
 * 将列表转换为指定键的 Map
 * @param list
 * @param key
 * @returns {{}}
 */
export function listToMap<T extends Record<string, any>>(list: T[], key: keyof T) {
  const result: Record<string, any> = {};
  list.forEach((item) => {
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

export function sleep(delay: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

export const StringUtil = {
  concatWith(glue: string, ...segment: string[]) {
    return segment.filter(Boolean).join(glue);
  },
};

export function getObjectValueOfKey<T = any>(key: string, config: Record<string, any>) {
  let temp: any = Object.assign({}, config);
  if (!key) {
    return temp;
  }
  const keyPath = key.split('.');
  let result: T = null as any;
  do {
    const keyItem = keyPath.shift();
    if (keyItem) {
      result = temp[keyItem];
      temp = result;
    }
  } while (keyPath.length);
  return (result as any) as T;
}

export function setObjectValueOfKey<T = any>(key: string, value: any, config: Record<string, any>) {
  let temp: any = config;
  if (!key) {
    return temp;
  }
  const keyPath = key.split('.');
  let result: T = null as any;
  do {
    const keyItem = keyPath.shift();
    const restLen = keyPath.length;
    if (keyItem) {
      result = temp[keyItem];
      if (!temp.hasOwnProperty(keyItem)) {
        temp[keyItem] = restLen ? {} : value;
      } else {
        temp[keyItem] = restLen ? result : value;
      }
      temp = result;
    }
  } while (keyPath.length);
  return config;
}

export function isValidJSONValue(value: any): value is string | number | boolean {
  return ['string', 'number', 'boolean'].includes(typeof value);
}
export function getPrintJSON(config: any) {
  const result: [string, string][] = [];
  Object.keys(config).forEach((i) => {
    const v = config[i];
    if (typeof v !== 'undefined' && !Array.isArray(v)) {
      if (typeof v === 'object') {
        Object.keys(v).forEach((vk) => {
          if (isValidJSONValue(v[vk])) {
            result.push([`${i}.${vk}`, v[vk]]);
          }
        });
      } else {
        result.push([i, v]);
      }
    }
  });
  return result;
}
