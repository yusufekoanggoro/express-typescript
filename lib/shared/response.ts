import { Response } from 'express';

interface IHTTPStatus {
  readonly code: number;
  readonly message: string;
}

const statusOK: IHTTPStatus = {
  code: 200,
  message: 'OK'
};

const statusCreated: IHTTPStatus = {
  code: 201,
  message: 'Created'
};

const statusNotFound: IHTTPStatus = {
  code: 404,
  message: 'Not Found'
};

const statusBadRequest: IHTTPStatus = {
  code: 400,
  message: 'Bad Request'
};

const statusUnauthorized: IHTTPStatus = {
  code: 401,
  message: 'Unauthorized'
};

const statusForbidden: IHTTPStatus = {
  code: 403,
  message: 'Forbidden'
};

const statusInternalServerError: IHTTPStatus = {
  code: 500,
  message: 'Internal Server Error'
};

const wrapper = (res: Response, type: IHTTPStatus, message = '', params = {}) =>
  res.status(type.code).json({
    succees: type.code <= 399 ? true : false,
    message: message === '' ? type.message : message,
    ...params
  });

export interface IBaseResponse {
  _id?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  deletedAt?: Date;
  deletedBy?: string;
}

export {
  wrapper,
  statusOK,
  statusCreated,
  statusNotFound,
  statusBadRequest,
  statusUnauthorized,
  statusForbidden,
  statusInternalServerError
};
