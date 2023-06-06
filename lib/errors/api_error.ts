import { BaseError } from '.';

export class NotFoundError extends BaseError {
  constructor(message = 'Not Found') {
    super(404, message);
  }
}
