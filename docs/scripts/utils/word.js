/**
 * 下划线转驼峰
 * @param {string} word
 * @return {string}
 */
function toCamel(word) {
  return word.replace(/([a-zA-Z])[_-]([a-zA-Z])/g, function(_, l, r) {
    return l + r.toUpperCase();
  });
}


/**
 * 首字母大写
 * @param {string} word
 * @return {(() => string) | string}
 */
function uppercaseFirst(word) {
  return word.length <= 1 ? word.toUpperCase : word[0].toUpperCase() + word.substr(1);
}

/**
 * 首字母小写
 * @param {string} word
 * @return {(() => string) | string}
 */
function lowercaseFirst(word) {
  return word.length <= 1 ? word.toLowerCase() : word[0].toLowerCase() + word.substr(1);
}

module.exports = {
  toCamel,
  uppercaseFirst,
  lowercaseFirst,
};