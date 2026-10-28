import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';

export interface TokenPayload {
  id: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
}

export const signAccessToken = (p: TokenPayload) =>
  jwt.sign(p, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as SignOptions);
export const signRefreshToken = (p: TokenPayload) =>
  jwt.sign(p, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
export const verifyAccessToken = (t: string) => jwt.verify(t, env.JWT_SECRET) as TokenPayload;
export const verifyRefreshToken = (t: string) => jwt.verify(t, env.JWT_REFRESH_SECRET) as TokenPayload;
