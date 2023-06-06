import http from 'http';
import express, { Express, Response, Router, NextFunction } from 'express';
import bodyParser from 'body-parser';
import {
  ExpressRequestWrapper,
  wrapper,
  statusOK,
  statusNotFound,
  logger,
  V1_API_GROUP
} from '../../lib';

import { user } from '../modules';

export default class HttpServer {
  private port: number;
  private app: Express;
  private baseRouter: Router;
  private expressServerInstance!: http.Server;

  public constructor(basePath: string, port: number) {
    this.port = port;
    this.app = express();

    // set middleware
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));

    // define base router and its child
    this.baseRouter = Router();

    this.app.use(basePath, this.baseRouter);

    // define api versioning
    this.baseRouter.use(
      '/users',
      user.v1.userApiHandler(V1_API_GROUP, user.v1.UserUsecase)
    );
  }

  private initRouter(): void {
    this.baseRouter.get(
      '/',
      async (req: ExpressRequestWrapper, res: Response, next: NextFunction) => {
        return wrapper(res, statusOK, 'server up and running');
      }
    );
  }

  private initErrorRoute(): void {
    this.baseRouter.use(
      (req: ExpressRequestWrapper, res: Response, next: NextFunction) => {
        return wrapper(res, statusNotFound, 'resource not found');
      }
    );
  }

  public async start(): Promise<void> {
    this.initRouter();
    this.initErrorRoute();

    this.expressServerInstance = this.app.listen(this.port, () => {
      return Promise.resolve();
    });

    logger.info(`HTTP Server running on port ${this.port}`);
  }

  public async shutdown(): Promise<void> {
    logger.info('Closing HTTP Server');

    this.expressServerInstance.close(() => {
      logger.info('HTTP Server closed');
      return Promise.resolve();
    });
  }
}
