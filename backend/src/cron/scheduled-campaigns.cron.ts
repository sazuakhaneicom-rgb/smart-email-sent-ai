import cron from 'node-cron';
import { campaignsRepository } from '../repositories/campaigns.repository';
import { logger } from '../utils/logger';

// Run every minute: check for campaigns scheduled to send now
cron.schedule('* * * * *', async () => {
  try {
    logger.debug('[scheduled-campaigns] Checking for campaigns ready to send...');
    const campaigns = await campaignsRepository.findScheduledReady();

    if (campaigns.length === 0) {
      return;
    }

    logger.info(`[scheduled-campaigns] Found ${campaigns.length} campaigns ready to send`);

    for (const campaign of campaigns) {
      try {
        // Update status to sending
        await campaignsRepository.update(campaign.workspaceId, campaign.id, {
          status: 'sending',
        });

        // Enqueue send job
        const { sendCampaignQueue } = await import('../jobs/queue');
        await sendCampaignQueue.add(
          `send-${campaign.id}`,
          {
            workspaceId: campaign.workspaceId,
            campaignId: campaign.id,
            batchSize: 50,
          },
          {
            attempts: 3,
            backoff: { type: 'exponential', delay: 5000 },
            jobId: `send-campaign-${campaign.id}`, // Prevent duplicate jobs
          }
        );

        logger.info(
          `[scheduled-campaigns] Enqueued campaign ${campaign.id} for workspace ${campaign.workspaceId}`
        );
      } catch (err) {
        logger.error(`[scheduled-campaigns] Failed to enqueue campaign ${campaign.id}:`, err);
        // Revert status back to scheduled on error
        await campaignsRepository.update(campaign.workspaceId, campaign.id, {
          status: 'scheduled',
        });
      }
    }
  } catch (err) {
    logger.error('[scheduled-campaigns] Cron error:', err);
  }
});

logger.info('✅ Scheduled campaigns cron started (every minute)');
