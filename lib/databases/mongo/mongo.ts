import { MongoClient, MongoClientOptions, Db as MongoDatabase } from 'mongodb';
import { get as getConf } from '../../../config';
import logger from '../../logger';

export interface IMongoConfig {
  url: string;
  maxPoolSize: number;
  keepAlive: boolean;
  socketTimeoutMS: number;
  connectTimeoutMS: number;
}

class Mongo {
  private static instance: Mongo;

  private client?: MongoClient;

  private constructor(config: IMongoConfig) {
    logger.info('init Mongo');

    const options: MongoClientOptions = {
      keepAlive: config.keepAlive,
      maxPoolSize: config.maxPoolSize,
      socketTimeoutMS: config.socketTimeoutMS,
      connectTimeoutMS: config.connectTimeoutMS
    };

    try {
      this.client = new MongoClient(config.url, options);
    } catch (err: any) {
      logger.error('error instantiate MongoClient');
      logger.error(err);
    }
  }

  // singleton static method
  public static getInstance(config: IMongoConfig): Mongo {
    return Mongo.instance ?? new Mongo(config);
  }

  public async connect(): Promise<void> {
    if (!this.client) {
      return Promise.reject('MongoClient is undefined or null');
    }

    logger.info('connecting to MongoDB Server...');
    try {
      await this.client.connect();

      logger.info('connected to MongoDB Server...');
      return Promise.resolve();
    } catch (e) {
      logger.error('error connecting to MongoDB Server');
      await this.close();
      return Promise.reject('error connecting to MongoDB Server');
    }
  }

  public async close(): Promise<void> {
    logger.info('closing connection to MongoDB Server...');
    if (this.client != null) {
      try {
        await this.client.close();

        logger.info('closed from MongoDB Server...');
        return Promise.resolve();
      } catch (e) {
        logger.error('error closing connection to MongoDB Server');
        return Promise.reject('error closing connection to MongoDB Server');
      }
    }
  }

  public getDatabase(databaseName: string): MongoDatabase {
    return this.client!.db(databaseName);
  }
}

const mongoConfig: IMongoConfig = {
  url: getConf('/mongoDbConfig').url,
  maxPoolSize: getConf('/mongoDbConfig').maxPoolSize,
  keepAlive: getConf('/mongoDbConfig').keepAlive === 'true' ? true : false,
  socketTimeoutMS: Number(getConf('/mongoDbConfig').socketTimeoutMS),
  connectTimeoutMS: Number(getConf('/mongoDbConfig').connectTimeoutMS)
};

export default Mongo.getInstance(mongoConfig);
