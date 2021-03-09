interface LocalCacheOptions {
  expire?: number;
}

interface CacheObject {
  value: any | any[];
  expire: number;
  createTime: number;
}

/**
 * 一个缓存工具类
 */
export default class LocalCache {
  /**
   *获取一个
   * @param {LocalCacheOptions} [options]
   * @return {LocalCache}
   */
  public static new(options?: LocalCacheOptions) {
    return new LocalCache(options);
  }

  /**
   * @type {Object.<{value: any, expire: number, createTime: number}>}
   * @private
   */
  private _cache: Record<string, CacheObject> = {};

  /**
   * 默认不过期
   * @type {number}
   * @private
   * @readonly
   */
  private readonly _expire: number = 0;

  /**
   * @private
   * @constructor
   * @param {LocalCacheOptions} [options]
   */
  private constructor(options?: LocalCacheOptions) {
    if (options?.expire && options.expire >= 0) {
      this._expire = options.expire;
    }
  }

  /**
   * 添加键值
   * @param {string} key - 键
   * @param {any|any[]} value - 值
   * @param {number} [expire=0] - 有效时间
   * @return {LocalCache}
   */
  public set(key: string, value: any | any[], expire = 0) {
    if (expire < 0) {
      return this;
    }
    this._cache[key] = {
      value,
      createTime: Date.now(),
      expire: expire || this._expire,
    };
    return this;
  }

  /**
   * 是否存在指定
   * @param {string} key - 键
   * @return {boolean}
   */
  public has(key: string) {
    if (!this._cache.hasOwnProperty(key)) {
      return false;
    }
    const o = this._cache[key];
    if (!o) {
      return false;
    }
    if (o.expire === 0) {
      return true;
    }
    if (Date.now() - o.createTime > o.expire) {
      delete this._cache[key];
      return false;
    }
    return true;
  }

  /**
   * 获取指定键值
   * @param {string} key - 键
   * @param {any|any[]} [defaultValue=null] - 默认值
   * @return {any}
   */
  public get(key: string, defaultValue: any = null) {
    return this.has(key) ? this._cache[key].value : defaultValue;
  }

  /**
   * 清空所有键值对
   * @return {LocalCache}
   */
  public clear() {
    this._cache = {};
    return this;
  }

  public remove(key: string) {
    if (this.has(key)) {
      delete this._cache[key];
    }
    return this;
  }

  public keys() {
    return Object.keys(this._cache);
  }
}
