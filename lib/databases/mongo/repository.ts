import { Db as MongoDatabase, Collection } from 'mongodb';
import { Mongo } from '.';
import { IBaseMongoEntity, BaseFilter } from '.';
import logger from '../../logger';

export interface IBaseRepositoryMongo<T extends IBaseMongoEntity> {
  save(t: T): Promise<void>;
  update(filter: T, data: T): Promise<T>;
  findOne(filter: T): Promise<T | null>;
  findAll(filter: BaseFilter): Promise<T[]>;
  count(filter: BaseFilter): Promise<number>;
}

export abstract class AbstractRepositoryMongo<T extends IBaseMongoEntity>
  implements IBaseRepositoryMongo<T>
{
  protected collection: Collection<T>;

  public constructor(databaseName: string, collectionName: string) {
    const db: MongoDatabase = Mongo.getDatabase(databaseName);
    this.collection = db.collection<T>(collectionName);
  }

  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/39358
  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/46375
  public async save(data: T): Promise<void> {
    try {
      const insertOneResult = await this.collection.insertOne(data as any);
      logger.info(
        `RepositoryMongo.save() succeed: ${insertOneResult.insertedId}`
      );

      return Promise.resolve();
    } catch (err: any) {
      logger.error(err);
      return Promise.reject('error: RepositoryMongo.save()');
    }
  }

  public async update(filter: T, data: T): Promise<T> {
    try {
      const updateOneResult = await this.collection.updateOne(filter as any, {
        $set: data
      });
      logger.info(
        `RepositoryMongo.update() succeed: ${updateOneResult.upsertedId}`
      );

      return Promise.resolve(data);
    } catch (err: any) {
      logger.error(err);
      return Promise.reject('error: RepositoryMongo.update()');
    }
  }

  public async findOne(filter: T): Promise<T | null> {
    try {
      const findOneResult = await this.collection.findOne<T>(filter as any);
      logger.info(`RepositoryMongo.findOne() succeed`);
      return Promise.resolve(findOneResult);
    } catch (err: any) {
      logger.error(err);
      return Promise.reject('error: RepositoryMongo.findOne()');
    }
  }

  public async findAll(filter: BaseFilter): Promise<T[]> {
    throw new Error('Method not implemented.');
  }

  public async count(filter: BaseFilter): Promise<number> {
    throw new Error('Method not implemented.');
  }
}
