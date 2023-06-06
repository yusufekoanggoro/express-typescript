import {
  AbstractRepositoryMongo,
  IBaseRepositoryMongo
} from '../../../../../lib';
import { User } from '../domain';
import { get as getConf } from '../../../../../config';

export interface IUserRepositoryMongo extends IBaseRepositoryMongo<User> {}

class UserRepositoryMongo
  extends AbstractRepositoryMongo<User>
  implements IUserRepositoryMongo
{
  private static instance: UserRepositoryMongo;

  private constructor(databaseName: string, collectionName: string) {
    super(databaseName, collectionName);
  }

  // singleton static method
  public static getInstance(
    databaseName: string,
    collectionName: string
  ): UserRepositoryMongo {
    return (
      UserRepositoryMongo.instance ??
      new UserRepositoryMongo(databaseName, collectionName)
    );
  }
}

export default UserRepositoryMongo.getInstance(
  getConf('/mongoDbConfig').dbName,
  'users'
);
