export class BaseError extends Error {
  httpCode: number;
  constructor(httpCode: number, message: string) {
    super(message);

    // assign the error class name in your custom error (as a shortcut)
    this.name = this.constructor.name;
    this.httpCode = httpCode;
  }
}

export * from './api_error';
