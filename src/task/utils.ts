// eslint-disable-next-line @typescript-eslint/no-empty-function
export function noop() {}

export function toPercent(progress: number) {
  return `${(progress * 100).toFixed(2)}%`;
}
