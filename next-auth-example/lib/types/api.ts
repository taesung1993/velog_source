export interface ISuccess<T extends unknown> {
  success: boolean;
  data: T;
}

export enum ErrorCodes {
  METHOD_NOT_ALLOWED = "METHOD_NOT_ALLOWED",
  SERVER_ERROR = "SERVER_ERROR",
}

export interface IError {
  code: ErrorCodes;
  message: string;
}
