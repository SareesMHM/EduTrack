import { prisma } from '../config/db';

export const listGrades = () =>
  prisma.grade.findMany({ orderBy: { name: 'asc' }, include: { _count: { select: { students: true, classes: true } } } });
export const createGrade = (data: { name: string }) => prisma.grade.create({ data });
export const updateGrade = (id: string, data: { name?: string }) => prisma.grade.update({ where: { id }, data });
export const deleteGrade = (id: string) => prisma.grade.delete({ where: { id } });
