type F = (...args: any[]) => void;
export const f: F = () => {
  const args = Array.prototype.slice.call(null, arguments);
}


