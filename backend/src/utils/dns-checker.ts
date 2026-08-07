import dns from 'dns/promises';

export interface DnsCheckResult {
  spf: boolean;
  dkim: boolean;
  dmarc: boolean;
  details: {
    spfRecord?: string;
    dkimRecord?: string;
    dmarcRecord?: string;
    errors: string[];
  };
}

export const checkDomainDns = async (
  domain: string,
  dkimSelector = 'smartemail'
): Promise<DnsCheckResult> => {
  const errors: string[] = [];
  let spf = false;
  let dkim = false;
  let dmarc = false;
  let spfRecord: string | undefined;
  let dkimRecord: string | undefined;
  let dmarcRecord: string | undefined;

  try {
    const txtRecords = await dns.resolveTxt(domain);
    const flat = txtRecords.map((r) => r.join(''));
    spfRecord = flat.find((r) => r.startsWith('v=spf1'));
    spf = !!spfRecord;
  } catch {
    errors.push(`SPF lookup failed for ${domain}`);
  }

  try {
    const dkimHost = `${dkimSelector}._domainkey.${domain}`;
    const dkimRecords = await dns.resolveTxt(dkimHost);
    dkimRecord = dkimRecords.map((r) => r.join('')).join('');
    dkim = dkimRecord.includes('v=DKIM1');
  } catch {
    errors.push(`DKIM lookup failed for ${domain}`);
  }

  try {
    const dmarcHost = `_dmarc.${domain}`;
    const dmarcRecords = await dns.resolveTxt(dmarcHost);
    dmarcRecord = dmarcRecords.map((r) => r.join('')).join('');
    dmarc = dmarcRecord.includes('v=DMARC1');
  } catch {
    errors.push(`DMARC lookup failed for ${domain}`);
  }

  return { spf, dkim, dmarc, details: { spfRecord, dkimRecord, dmarcRecord, errors } };
};
