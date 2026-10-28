declare namespace Express {
  interface Request {
    user?: { id: string; role: 'ADMIN' | 'TEACHER' | 'STUDENT' };
  }
}
