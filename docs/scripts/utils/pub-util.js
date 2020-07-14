const copy = require('copy');
const logger = require('./pub-log');

const rimraf = require('rimraf');

function cp(src, dist, cb) {
  rimraf(dist, (err) => {
    if (err) {
      console.log(err);
      process.exit();
    }
    copy(src, dist, function (err) {
      if (err) {
        console.log(err);
        process.exit();
      }
      cb && cb();
    });
  });
}

module.exports = function pub(src, dist, title = '') {
  let start = Date.now();
  const distList = Array.isArray(dist) ? dist : [dist];
  const len = distList.length;
  distList.forEach((item, index) => {
    cp(src, item, () => {
      if (index === len - 1) {
        logger.log('-----------------------------------------------------------')
        logger.success(`===============用时${Math.floor((Date.now() - start))}ms ${title}发布成功！==================`);
        logger.log('-----------------------------------------------------------')
      }
    });
  })
};