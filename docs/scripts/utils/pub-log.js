const chalk = require('chalk');


module.exports = {
  log(...message) {
    console.log.apply(null, message);
  },
  info(...message) {
    console.log(chalk.blue(message.join('')));
  },
  warn(...message) {
    console.log(chalk.yellow(message.join('')));
  },
  error(...message) {
    console.log(chalk.red(message.join('')));
  },
  success(...message) {
    console.log(chalk.green(message.join('')));
  },
};