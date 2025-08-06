import app from './app';
import cron from 'node-cron';
import logger from './utils/logger';
import cleanupExpiredLocks from './utils/crons/cleanupExpiredLocks';

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  logger.info(`Server is running at http://localhost:${port}`);

  // Start the cleanup cron job *after* server is listening
  cron.schedule('*/10 * * * *', () => {
    logger.info(
      '[Cleanup] Running scheduled cleanup of expired locked applications'
    );
    cleanupExpiredLocks()
      .then(() => {
        logger.info(
          '[Cleanup] Completed cleanup of expired locked applications'
        );
      })
      .catch((error) => {
        logger.error('[Cleanup] Error during cleanup of expired locks:', error);
      });
  });
  logger.info(
    '[Cleanup] Scheduled cleanup of expired locked applications every 10 minutes'
  );
});
