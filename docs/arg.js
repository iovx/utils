/**
 *
 * @param {string} name
 * @returns {T[]}
 */
function f(/*...*/) {
  const args = Array.prototype.slice.call(null, arguments);
  return args;
}

f('wind')