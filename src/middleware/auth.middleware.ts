import { NextFunction, Response, Request } from 'express';
import { validateAccessToken } from '../helper/auth.helper';

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.cookies;

  const user = validateAccessToken(token);
  req.user = user;
  next();
};
