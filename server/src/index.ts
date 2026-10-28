import { app } from './app';
import { prisma } from './config/db';
import { env } from './config/env';
import { logger } from './utils/logger';

async function main() {
  await prisma.$connect();
  const server = app.listen(env.PORT, () => logger.info(`EduTrack API listening on :${env.PORT}`));
  const shutdown = async () => {
    server.close();
    await prisma.$disconnect();
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((e) => {
  logger.error('Failed to start', { message: e.message });
  process.exit(1);
});
