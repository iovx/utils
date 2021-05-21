export function compile(pattern: string) {
  const p = pattern.replace(/\*{2,}/g, '[\\w/]+?').replace(/\*/g, '[\\w]+?');
  return new RegExp(`^${p}$`, 'i');
}

export function match(pattern: string, testStr: string) {
  return compile(pattern).test(testStr);
}
