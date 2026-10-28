import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const ALLOWED = new Map([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
]);

export const uploadDir = path.resolve(process.cwd(), 'uploads');

export const uploadAvatar = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (_req, file, cb) => cb(null, `${crypto.randomUUID()}${ALLOWED.get(file.mimetype) ?? ''}`),
  }),
  limits: { fileSize: 2 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) =>
    ALLOWED.has(file.mimetype) ? cb(null, true) : cb(new Error('Only JPEG, PNG or WebP images are allowed')),
}).single('avatar');
