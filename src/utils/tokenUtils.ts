import jwt from 'jsonwebtoken';
import { config } from '../config/config';

export const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, config.JWT_SECRET, { expiresIn: '24h' });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, config.JWT_SECRET);
};
