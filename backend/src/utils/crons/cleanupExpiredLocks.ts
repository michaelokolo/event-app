import { application } from 'express';
import prisma from '../db/prisma';
import logger from '../logger';

const LOCK_TIMEOUT_MINUTES = 30;

export default async function cleanupExpiredLocks() {
  const expiryDate = new Date(Date.now() - LOCK_TIMEOUT_MINUTES * 60 * 1000);

  logger.info(
    `[Cleanup] Cleaning up expired locked applications older than ${expiryDate.toISOString()}`
  );

  const expiredLocks = await prisma.application.findMany({
    where: {
      lockedAt: {
        lt: expiryDate,
      },
      deleted: false,
    },
    include: {
      history: true,
    },
  });

  if (expiredLocks.length === 0) {
    logger.info('[Cleanup] No expired locked applications found');
    return;
  }

  logger.info(
    `[Cleanup] Found ${expiredLocks.length} expired locked applications`
  );

  for (const application of expiredLocks) {
    const lastHistoryEntry =
      application.history[application.history.length - 1];
    const changedById =
      lastHistoryEntry?.changedById ||
      application.lockedById ||
      application.freelancerId;

    await prisma.application.update({
      where: { id: application.id },
      data: {
        lockedAt: null,
        lockedById: null,
        updatedAt: new Date(),
        history: {
          create: {
            previousStatus: application.status,
            newStatus: application.status,
            changedById: changedById,
            reason: 'Lock expired and automatically released',
          },
        },
      },
    });
    logger.info(`[Cleanup] Released lock for application ID ${application.id}`);
  }
}

cleanupExpiredLocks()
  .catch((e) => {
    logger.error('[Cleanup] Error during cleanup of expired locks:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
