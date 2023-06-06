import winston from 'winston';
import { ILogger } from './logger';

export class WinstonLogger implements ILogger {
  private static instance: WinstonLogger;
  private winstonLogger: winston.Logger;

  private constructor() {
    this.winstonLogger = winston.createLogger({
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json(),
        winston.format.colorize({ all: true })
      ),
      transports: [new winston.transports.Console()]
    });
  }

  // singleton static method
  public static getInstance(): WinstonLogger {
    return WinstonLogger.instance ?? new WinstonLogger();
  }

  public debug(message: string, ...meta: any[]) {
    this.winstonLogger.debug(message, meta);
  }

  public info(message: string, ...meta: any[]) {
    this.winstonLogger.info(message, meta);
  }

  public error(message: string, ...meta: any[]) {
    this.winstonLogger.error(message, meta);
  }

  public trace(message: string, ...meta: any[]) {
    this.winstonLogger.verbose(message, meta);
  }

  public warn(message: string, ...meta: any[]) {
    this.winstonLogger.warn(message, meta);
  }

  public http(message: string, ...meta: any[]) {
    this.winstonLogger.http(message, meta);
  }
}
