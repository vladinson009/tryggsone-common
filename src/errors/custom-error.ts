import type { ContentfulStatusCode } from './types.js';

export type Code =
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'SESSION_NOT_FOUND'
  | 'INTERNAL_SERVER_ERROR'
  | (string & {});

export abstract class CustomError extends Error {
  abstract readonly code: string;
  abstract readonly status: ContentfulStatusCode;
  readonly isCustomError = true;

  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = new.target.name;
  }
}

export class ServiceError extends CustomError {
  constructor(
    public readonly code: Code,
    public readonly status: ContentfulStatusCode,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
  }
}
export class BadRequestError extends ServiceError {
  constructor(message = 'Bad Request') {
    super('BAD_REQUEST', 400, message);
  }
}
export class UnauthorizedError extends ServiceError {
  constructor(message = 'Unauthorized') {
    super('UNAUTHORIZED', 401, message);
  }
}
export class ForbiddenError extends ServiceError {
  constructor(message = 'Forbidden') {
    super('FORBIDDEN', 403, message);
  }
}
export class NotFoundError extends ServiceError {
  constructor(message = 'Not found') {
    super('NOT_FOUND', 404, message);
  }
}
export class ConflictError extends ServiceError {
  constructor(message = 'Conflict') {
    super('CONFLICT', 409, message);
  }
}
export class InternalServerError extends ServiceError {
  constructor(message = 'Internal server error', options?: ErrorOptions) {
    super('INTERNAL_SERVER_ERROR', 500, message, options);
  }
}
