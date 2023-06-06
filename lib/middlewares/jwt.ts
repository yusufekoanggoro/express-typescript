import { Response, NextFunction, RequestHandler } from 'express';
import { Jwt } from 'jsonwebtoken';
import { jwtUtil, statusUnauthorized, wrapper, logger } from '..';

import { ExpressRequestWrapper } from '../shared';

export default function (): RequestHandler {
  return function (
    req: ExpressRequestWrapper,
    res: Response,
    next: NextFunction
  ) {
    const headers = req.headers;
    if (headers.authorization === '' || headers.authorization == undefined) {
      return wrapper(res, statusUnauthorized, 'required authorization headers');
    }

    const parted = headers.authorization.split(' ');
    if (parted.length < 2) {
      return wrapper(res, statusUnauthorized, 'invalid authorization headers');
    }

    const scheme = parted[0];

    if (!/^bearer$/i.test(scheme.toLowerCase())) {
      return wrapper(res, statusUnauthorized, 'invalid access token format');
    }

    try {
      const decodedJwt = jwtUtil.verify(parted[1], 5);
      const { header, payload, signature }: Jwt = decodedJwt;

      logger.info('---------');
      logger.info('jwt header', header);
      logger.info('jwt payload', payload);
      logger.info('jwt signature', signature);

      // set user property to request object
      req.user = payload.sub;
    } catch (e) {
      return wrapper(
        res,
        statusUnauthorized,
        'access token expired or in invalid format'
      );
    }

    logger.info('jwt verify succeed, go to the next route');
    return next();
  };
}
