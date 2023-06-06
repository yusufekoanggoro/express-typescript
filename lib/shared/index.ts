import { Request } from 'express';

export type ExpressRequestWrapper = Request & { user?: any };

export * from './response';
export * from './constants';

export class Result<T, E> {
  private data: T;
  private error: E;

  private constructor(data: T, error: E) {
    this.data = data;
    this.error = error;
  }

  public static from<T, E>(data: T, error: E): Result<T, E> {
    return new Result<T, E>(data, error);
  }

  public getData(): T {
    return this.data;
  }

  public getErr(): E {
    return this.error;
  }

  public isErr(): boolean {
    return this.error != null;
  }
}
