import { Response, Router, NextFunction } from 'express';
import {
  statusOK,
  wrapper,
  ExpressRequestWrapper,
  statusInternalServerError,
  statusNotFound,
  NotFoundError,
  statusBadRequest
} from '../../../../../lib';
import { IUserUsecase } from '..';
import { validateAndParseRequest } from '../domain';

export default function (version: string, userUsecase: IUserUsecase): Router {
  // router versioning
  const routerV1 = Router();
  const router = Router();

  routerV1.use(version, router);

  // define endpoint

  // get profile route
  router.get(
    '/get-profile',
    async (req: ExpressRequestWrapper, res: Response, next: NextFunction) => {
      const userId = req.user;
      try {
        const payload = {
          user: req.user,
          ...req.params
        };
        const validate = validateAndParseRequest(payload);
        if (validate.isErr()) {
          return wrapper(res, statusBadRequest, `${validate.getErr()}`);
        }

        const profile = await userUsecase.getProfile(userId);

        return wrapper(res, statusOK, 'get profile succeed', {
          data: profile
        });
      } catch (err: any) {
        if (err instanceof NotFoundError) {
          return wrapper(res, statusNotFound, err.message);
        }
        return wrapper(res, statusInternalServerError, err);
      }
    }
  );

  return routerV1;
}
