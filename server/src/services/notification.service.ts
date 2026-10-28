import { prisma } from '../config/db';

export const listNotifications = (userId: string, unreadOnly = false) =>
  prisma.notification.findMany({
    where: { userId, ...(unreadOnly ? { read: false } : {}) },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

export const markRead = (userId: string, id: string) =>
  prisma.notification.updateMany({ where: { id, userId }, data: { read: true } });
export const markAllRead = (userId: string) =>
  prisma.notification.updateMany({ where: { userId, read: false }, data: { read: true } });

export const notifyMany = (userIds: string[], title: string, body: string) =>
  userIds.length
    ? prisma.notification.createMany({ data: userIds.map((userId) => ({ userId, title, body })) })
    : Promise.resolve();
