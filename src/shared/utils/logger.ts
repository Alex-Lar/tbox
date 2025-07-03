import consola from 'consola';

class Logger {
  private static instance: consola.ConsolaInstance;

  static init(options: Partial<consola.ConsolaOptions>) {
    this.instance = consola.create(options);
  }

  static log(message: unknown, ...args: unknown[]) {
    this.instance.log(message, ...args);
  }

  static info(message: unknown, ...args: unknown[]) {
    this.instance.info(message, ...args);
  }

  static start(message: unknown, ...args: unknown[]) {
    this.instance.start(message, ...args);
  }

  static warn(message: unknown, ...args: unknown[]) {
    this.instance.warn(message, ...args);
  }

  static success(message: unknown, ...args: unknown[]) {
    this.instance.success(message, ...args);
  }

  static error(message: unknown, ...args: unknown[]) {
    this.instance.error(message, ...args);
  }

  static box(message: unknown, ...args: unknown[]) {
    this.instance.box(message, ...args);
  }

  static debug(message: unknown, ...args: unknown[]) {
    this.instance.debug(message, ...args);
  }
}

Logger.init({
  level: 3,
  formatOptions: {
    columns: 80,
    colors: true,
    compact: true,
    date: false,
  },
});

export default Logger;
