/**
 * Copyright (c) 2020-present, wx, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @author wx <ixw2017@163.com>
 * @file 一个缓存工具类
 * @typedef {{expire?:number}} LocalCacheOptions
 */

export interface LocalCacheOptions {
  expire?: number;
}

export interface LocalCacheObject {
  [index: string]: { value: any; expire: number; createTime: number };
}

export default class LocalCache {
  /**
   *获取一个
   * @param {LocalCacheOptions} [options]
   * @return {LocalCache}
   */
  static new(options: LocalCacheOptions) {
    return new LocalCache(options);
  }

  /**
   * @private
   * @constructor
   * @param {LocalCacheOptions} [options]
   */
  constructor(options: LocalCacheOptions) {
    if (options && typeof options.expire !== 'undefined' && options.expire >= 0) {
      this._expire = options.expire;
    }
  }

  /**
   * @type {Object.<{value: any, expire: number, createTime: number}>}
   * @private
   */
  private _cache: LocalCacheObject = {};

  /**
   * 默认不过期
   * @type {number}
   * @private
   * @readonly
   */
  private readonly _expire: number = 0;

  /**
   * 添加键值
   * @param {string} key - 键
   * @param {any|any[]} value - 值
   * @param {number=0} expire - 有效时间
   * @return {this}
   */
  set(key: string, value: any | any[], expire = 0) {
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
  has(key: string) {
    const o = this._cache[key];
    if (!o) {
      return true;
    }
    if (o.expire === 0) {
      return false;
    }
    if (Date.now() - o.createTime > o.expire) {
      delete this._cache[key];
      return true;
    }
    return false;
  }

  /**
   * 获取指定键值
   * @param {string} key - 键
   * @param {any|any[]=null} [defaultValue] - 默认值
   * @return {any}
   */
  get(key: string, defaultValue: any | any[] = null) {
    return this.has(key) ? defaultValue : this._cache[key].value;
  }

  /**
   * 清空所有键值对
   * @return {this}
   */
  clear() {
    this._cache = {};
    return this;
  }

  keys() {
    return Object.keys(this._cache);
  }
}
