import cron from 'node-cron';
import { domainsRepository } from '../repositories/domains.repository';
import { checkDomainDns } from '../utils/dns-checker';
import { logger } from '../utils/logger';

// Run every hour: re-check pending domain DNS verifications
cron.schedule('0 * * * *', async () => {
  try {
    logger.debug('[domain-recheck] Checking pending domain verifications...');
    const pendingDomains = await domainsRepository.findPendingDomains();

    if (pendingDomains.length === 0) {
      logger.debug('[domain-recheck] No pending domains found');
      return;
    }

    logger.info(`[domain-recheck] Rechecking ${pendingDomains.length} pending domains`);

    for (const domain of pendingDomains) {
      try {
        logger.debug(`[domain-recheck] Checking DNS for: ${domain.domain}`);
        const result = await checkDomainDns(domain.domain, domain.dkimSelector);

        await domainsRepository.updateVerificationStatus(domain.workspaceId, domain.id, {
          spfVerified: result.spf,
          dkimVerified: result.dkim,
          dmarcVerified: result.dmarc,
          spfRecord: result.details.spfRecord,
          dkimRecord: result.details.dkimRecord,
          dmarcRecord: result.details.dmarcRecord,
        });

        const allVerified = result.spf && result.dkim && result.dmarc;
        if (allVerified) {
          logger.info(`[domain-recheck] Domain ${domain.domain} fully verified!`);
          // TODO: Send notification email to workspace owner
        } else {
          logger.debug(
            `[domain-recheck] Domain ${domain.domain} not yet fully verified — SPF: ${result.spf}, DKIM: ${result.dkim}, DMARC: ${result.dmarc}`
          );
        }
      } catch (err) {
        logger.error(`[domain-recheck] Failed to check domain ${domain.domain}:`, err);
      }

      // Small delay between domain checks to avoid DNS rate limits
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    logger.info('[domain-recheck] Hourly recheck complete');
  } catch (err) {
    logger.error('[domain-recheck] Cron error:', err);
  }
});

logger.info('✅ Domain recheck cron started (every hour)');
