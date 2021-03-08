/* eslint-disable no-console*/
const log = {
  open: true,
  disable() {
    this.open = false;
    return this;
  },
  log(...args: any[]) {
    if (!this.open) {
      return;
    }
    return console.log(...args);
  },
  success(...args: any[]) {
    if (!this.open) {
      return;
    }
    return console.log(...args);
  },
  warn(...args: any[]) {
    if (!this.open) {
      return;
    }
    return console.warn(...args);
  },
  info(...args: any[]) {
    if (!this.open) {
      return;
    }
    return console.info(...args);
  },
  error(...args: any[]) {
    if (!this.open) {
      return;
    }
    return console.error(...args);
  },
};

export function getSimpleTimeTag() {
  const date = new Date();
  const h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();
  const ms = date.getMilliseconds();

  function i(s: number, fillLength = 2) {
    return s < 10 ? `0${s}` : `${s}`;
  }

  return [i(h), i(m), [i(s), ms].join('.')].join(':');
}

export class TagLogger {
  private tag: () => string;
  static log = log;

  setTag(tag: string | (() => string)) {
    this.tag = typeof tag === 'string' ? () => tag : tag;
    return this;
  }

  setTimeTag() {
    this.setTag(getSimpleTimeTag);
    return this;
  }

  constructor(tag?: string | (() => string)) {
    tag && this.setTag(tag);
  }

  private getArgs(args: any[]) {
    if (this.tag) {
      args.unshift(`[${this.tag()}] `);
    }
    return args;
  }

  log(...args: any[]) {
    log.log(...this.getArgs(args));
  }

  info(...args: any[]) {
    log.info(...this.getArgs(args));
  }

  warn(...args: any[]) {
    log.warn(...this.getArgs(args));
  }

  error(...args: any[]) {
    log.error(...this.getArgs(args));
  }

  success(...args: any[]) {
    log.success(...this.getArgs(args));
  }
}

export default log;
