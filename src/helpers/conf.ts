import { MapType } from './interface';

export function conf2Obj(data: string, comment = false) {
  const result: { [index: string]: any } = {};
  let parent = result;
  const paths = [parent];
  const c = comment ? /^;/ : /^[;#]/;
  const lines = data
    .split('\n')
    .map((i) => i.trim())
    .filter(Boolean);
  lines.forEach((line) => {
    if (c.test(line)) {
      return;
    }
    if (/{$/.test(line)) {
      paths.push((parent = paths[paths.length - 1][line.match(/(.+?)\s+{/)![1]] = {}));
      return;
    }
    if (/}$/.test(line)) {
      paths.pop();
      parent = paths[paths.length - 1];
      return;
    }
    if (line.length < 2) {
      return;
    }
    const [, key, value] = line.slice(0, -1).match(/(.+?)\s+(.*)/)!;
    if (parent[key]) {
      if (typeof parent[key] === 'string') {
        parent[key] = [parent[key]];
      }
      parent[key].push(value);
      return;
    }
    parent[key] = value;
  });
  return result;
}

export function obj2Conf(obj: MapType) {
  function loop(o: MapType, lines: string[] = [], depth = 0) {
    Object.keys(o).forEach((k) => {
      const v = o[k];
      const tab = '\t'.repeat(depth);
      if (typeof v === 'string') {
        lines.push(`${tab}${k}\t${v};`);
        return;
      }
      if (Array.isArray(v)) {
        v.forEach((i) => lines.push(`${tab}${k}\t${i};`));
        return;
      }
      if (typeof v === 'object') {
        lines.push(`${tab}${k} {`);
        loop(v, lines, depth + 1);
        lines.push(`${tab}}`);
      }
    });
    return lines;
  }

  return loop(obj).join('\n');
}
