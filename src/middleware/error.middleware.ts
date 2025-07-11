// middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

// import { NextFunction, Request } from 'express';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = error.statusCode || 500;
  console.log(error.stack);
  const stack = error.stack;

  res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal Server Error',
    stack,
  });
};
