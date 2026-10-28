import { prisma } from '../config/db';
import { notFound } from '../utils/httpError';

export const listSubjects = () => prisma.subject.findMany({ orderBy: { name: 'asc' } });
export const getSubject = async (id: string) => {
  const s = await prisma.subject.findUnique({ where: { id } });
  if (!s) throw notFound('Subject not found');
  return s;
};
export const createSubject = (data: { name: string; code: string }) => prisma.subject.create({ data });
export const updateSubject = (id: string, data: object) => prisma.subject.update({ where: { id }, data });
export const deleteSubject = (id: string) => prisma.subject.delete({ where: { id } });
