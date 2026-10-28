import { CorsOptions } from 'cors';
import { env } from './env';

export const corsOptions: CorsOptions = {
  origin: env.CLIENT_URL.split(',').map((s) => s.trim()),
  credentials: true,
};
