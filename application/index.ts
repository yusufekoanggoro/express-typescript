import { HttpServer } from './server';
import { get as getConf } from '../config';
import logger from '../lib/logger';

const HTTP_PORT = getConf('/httpPort');
const BASE_PATH = getConf('/basePath');
const httpServer = new HttpServer(BASE_PATH, HTTP_PORT);

export async function initApplication() {
  try {
    logger.info('begin initApplication');

    await httpServer.start();
  } catch (err: any) {
    logger.error('error init application');
    logger.error(err);
    process.exit(1);
  }
}

async function shutdown() {
  try {
    logger.info('begin shutdown application');

    await httpServer.shutdown();

    process.exit(0);
  } catch (err: any) {
    logger.error('error shutdown application');
    logger.error(err);
  }
}

export function gracefulShutdown(): void {
  process.on('exit', () => {
    logger.info('on exit');
    shutdown();
  });

  process.on('SIGINT', () => {
    logger.info('on SIGINT');
    shutdown();
  });

  process.on('SIGUSR1', () => {
    logger.info('on SIGUSR1');
    shutdown();
  });

  process.on('SIGTERM', () => {
    logger.info('on SIGTERM');
    shutdown();
  });
}
