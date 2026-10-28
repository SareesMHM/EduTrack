import { prisma } from '../config/db';
import { logger } from '../utils/logger';

export async function audit(userId: string | undefined, action: string, entity: string, entityId?: string, metadata?: object) {
  try {
    await prisma.auditLog.create({ data: { userId, action, entity, entityId, metadata } });
  } catch (e) {
    logger.warn('audit log failed', { action, entity });
  }
}
