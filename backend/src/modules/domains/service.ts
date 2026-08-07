import { domainsRepository } from '../../repositories/domains.repository';
import { checkDomainDns } from '../../utils/dns-checker';
import { AddDomainDto } from './validation';
import { logger } from '../../utils/logger';
import crypto from 'crypto';

export class DomainsService {
  async findAll(workspaceId: string) {
    return domainsRepository.findAll(workspaceId);
  }

  async findById(workspaceId: string, domainId: string) {
    const domain = await domainsRepository.findById(workspaceId, domainId);
    if (!domain) throw new Error('Domain not found');
    return domain;
  }

  async add(workspaceId: string, dto: AddDomainDto) {
    const existing = await domainsRepository.findByDomain(workspaceId, dto.domain);
    if (existing) throw new Error('Domain already added to this workspace');

    // Generate DKIM key pair (in production, use real key generation)
    const dkimPublicKey = crypto.randomBytes(64).toString('base64');

    const domain = await domainsRepository.create(workspaceId, {
      ...dto,
      dkimPublicKey,
    });

    logger.info(`Domain added: ${dto.domain} for workspace ${workspaceId}`);
    return {
      ...domain,
      instructions: {
        spf: `Add TXT record to ${dto.domain}: "v=spf1 include:amazonses.com ~all"`,
        dkim: `Add TXT record to ${dto.dkimSelector || 'smartemail'}._domainkey.${dto.domain}: "v=DKIM1; k=rsa; p=${dkimPublicKey}"`,
        dmarc: `Add TXT record to _dmarc.${dto.domain}: "v=DMARC1; p=quarantine; rua=mailto:dmarc@${dto.domain}"`,
      },
    };
  }

  async delete(workspaceId: string, domainId: string) {
    const deleted = await domainsRepository.delete(workspaceId, domainId);
    if (!deleted) throw new Error('Domain not found');
    return { deleted: true };
  }

  async verify(workspaceId: string, domainId: string) {
    const domain = await domainsRepository.findById(workspaceId, domainId);
    if (!domain) throw new Error('Domain not found');

    logger.info(`Checking DNS for domain: ${domain.domain}`);
    const result = await checkDomainDns(domain.domain, domain.dkimSelector);

    const updated = await domainsRepository.updateVerificationStatus(workspaceId, domainId, {
      spfVerified: result.spf,
      dkimVerified: result.dkim,
      dmarcVerified: result.dmarc,
      spfRecord: result.details.spfRecord,
      dkimRecord: result.details.dkimRecord,
      dmarcRecord: result.details.dmarcRecord,
    });

    return { domain: updated, dnsCheck: result };
  }
}

export const domainsService = new DomainsService();
