import { payloadModel, user } from '../dto/user.dto';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

export const createAccessToken = (user: payloadModel): string => {
  try {
    const token = jwt.sign(user, process.env.JWT_SECRET_KEY);
    return token;
  } catch (error) {
    console.log(error);
    return '';
  }
};

export const validateAccessToken = (token: string) => {
  try {
    const varify = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return varify;
  } catch (e) {
    console.log(e);
  }
};

export const generateRandomToken = () => {
  const token = crypto.randomBytes(8).toString('hex');
  return token;
};

export const expireToken = () => {
  const date = new Date();
  return new Date(date.getTime() + 60 * 60 * 1000);
};

export const hashPassword = async (password: string, salt: number) => {
  return await bcrypt.hash(password, salt);
};
export const verifyPassword = async (newPassword: string, password: string) => {
  return await bcrypt.compare(newPassword, password);
};
