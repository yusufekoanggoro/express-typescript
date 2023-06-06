import { IUserRepositoryMongo, UserRepositoryMongo } from '../repository';
import { IUserResponse, getProfileResponse, queryBuilder } from '../domain';
import { NotFoundError } from '../../../../../lib';

export interface IUserUsecase {
  getProfile(userId: string): Promise<IUserResponse>;
}

class UserUsecase implements IUserUsecase {
  private static instance: UserUsecase;

  private userRepository: IUserRepositoryMongo;

  private constructor(userRepository: IUserRepositoryMongo) {
    this.userRepository = userRepository;
  }

  // singleton static method
  public static getInstance(userRepository: IUserRepositoryMongo): UserUsecase {
    return UserUsecase.instance ?? new UserUsecase(userRepository);
  }

  public async getProfile(userId: string): Promise<IUserResponse> {
    try {
      const qB = queryBuilder.getUserById(userId);
      const user = await this.userRepository.findOne(qB);
      if (user === null) return Promise.reject(new NotFoundError());

      return Promise.resolve(getProfileResponse(user));
    } catch (err: any) {
      return Promise.reject(err);
    }
  }
}

export default UserUsecase.getInstance(UserRepositoryMongo);
