/**
 * 将弧度转为角度
 * @param {number} arc [弧度]
 * @returns {number} [角度值]
 */
export function toAngle(arc: number) {
  return (arc / Math.PI) * 180;
}

/**
 * 将角度转为弧度
 * @param {number} angle  [角度]
 * @returns {number} [弧度值]
 */
export function toArc(angle: number) {
  return (angle / 180) * Math.PI;
}
