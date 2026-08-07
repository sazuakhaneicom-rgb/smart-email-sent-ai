import { Response } from 'express';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const sendSuccess = (
  res: Response,
  data: unknown,
  statusCode = 200,
  meta?: PaginationMeta
) => {
  const responseObj: Record<string, unknown> = {
    success: true,
    data,
  };

  if (meta) {
    responseObj.meta = meta;
  }

  return res.status(statusCode).json(responseObj);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode = 500,
  code = 'INTERNAL_ERROR',
  details?: unknown
) => {
  const errorObj: Record<string, unknown> = {
    code,
    message,
  };

  if (details !== undefined) {
    errorObj.details = details;
  }

  return res.status(statusCode).json({
    success: false,
    error: errorObj,
  });
};
