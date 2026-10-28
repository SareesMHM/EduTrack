import { ErrorRequestHandler } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import multer from 'multer';
import { HttpError } from '../utils/httpError';
import { logger } from '../utils/logger';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: err.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
    });
  }
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message, details: err.details });
  }
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({ message: 'A record with these values already exists', fields: err.meta?.target });
    }
    if (err.code === 'P2025') return res.status(404).json({ message: 'Record not found' });
    if (err.code === 'P2003') return res.status(409).json({ message: 'Related record is missing or still in use' });
  }
  if (err instanceof multer.MulterError || err?.message === 'Only JPEG, PNG or WebP images are allowed') {
    return res.status(400).json({ message: err.message });
  }
  logger.error(err?.message ?? 'Unhandled error', { stack: err?.stack });
  res.status(500).json({ message: 'Something went wrong on our side' });
};
