import { IBaseMongoEntity } from '../../../../../lib';

export interface User extends IBaseMongoEntity {
  username?: string;
  password?: string;
  profilePic?: string;
}

export * from './user_response';
export * from './get_profile_request';
export * as queryBuilder from './query_buider';
