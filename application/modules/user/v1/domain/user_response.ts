import { User } from '.';
import { IBaseResponse } from '../../../../../lib';

export interface IUserResponse extends IBaseResponse {
  username?: string;
  profilePic?: string;
}

export function getProfileResponse(user: User): IUserResponse {
  return {
    _id: user._id?.toString(),
    username: user.username,
    createdAt: user.createdAt,
    createdBy: user.createdBy,
    updatedAt: user.updatedAt,
    updatedBy: user.updatedBy
  };
}
