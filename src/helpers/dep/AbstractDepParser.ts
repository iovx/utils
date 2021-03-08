import { MapType } from '../interface';

export interface AbstractDepParserOptions {
  registry: MapType<string>;
}

export default abstract class AbstractDepParser {
  protected extendPattern = /extend:(\w+)/;
  protected depKeyPattern = /:\s*(\w+)\s*/;
  protected registry: MapType<string> = {};

  constructor(options: AbstractDepParserOptions) {
    this.registry = options.registry;
  }

  abstract getFileData(path: string): Promise<string>;

  abstract transfer(data: string): object;

  protected async load(file: string) {
    const data = await this.getFileData(file);
    return this.transfer(data);
  }

  protected loadKeyFn(registry: MapType) {
    return async (key: string) => await this.load(registry[key]);
  }

  protected _parse(mainKey: string, registry: MapType<string>) {
    const cache: MapType<any> = {};
    const loadKey = this.loadKeyFn(registry);
    const load = (key: string) => {
      if (cache[key]) {
        return Promise.resolve(cache[key]);
      }
      return loadKey(key);
    };
    const depMap: MapType<string[]> = {};
    const extendPattern = this.depKeyPattern;
    const depKeyPattern = this.extendPattern;

    async function loop(mainKey: string, parentDep: string[] = []) {
      if (!depMap[mainKey]) {
        depMap[mainKey] = parentDep.concat([mainKey]);
      }
      const currentPath = depMap[mainKey];
      const data = await load(mainKey);
      cache[mainKey] = data;
      const extend = Object.keys(data)
        .filter((i) => typeof data[i] === 'string' && extendPattern.test(data[i] as string))
        .reduce((acc, c) => {
          acc[c] = data[c];
          return acc;
        }, {} as MapType<string>);
      const tempKeys = Object.keys(extend);
      const extendKeys = tempKeys.map((k) => extend[k].match(depKeyPattern)![1]);
      if (!extendKeys.length) {
        return data;
      }
      const repeatItems = extendKeys.filter((i) => currentPath.indexOf(i) !== -1);
      if (repeatItems.length) {
        throw new Error(
          [
            '检测到循环依赖',
            [mainKey, repeatItems.length > 1 ? `{${repeatItems.join(', ')}}` : repeatItems.join('')]
              .concat(currentPath.slice(0, -1).reverse())
              .join('->'),
          ].join('')
        );
      }
      const extendConfigList = await Promise.all(extendKeys.map((k, _i) => loop(k, currentPath)));
      tempKeys.forEach((k, i) => (data[tempKeys[i]] = extendConfigList[i]));
      return data;
    }

    return loop(mainKey);
  }

  public parse(key: string) {
    return this._parse(key, this.registry);
  }
}
