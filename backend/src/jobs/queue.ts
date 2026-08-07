import { Queue, Worker } from 'bullmq';
import { redis } from '../config/redis';

const connection = redis;

export const sendCampaignQueue = new Queue('send-campaign', { connection });
export const importContactsQueue = new Queue('import-contacts', { connection });
export const exportContactsQueue = new Queue('export-contacts', { connection });
export const domainVerifyQueue = new Queue('domain-verify', { connection });

export { Worker, connection };
