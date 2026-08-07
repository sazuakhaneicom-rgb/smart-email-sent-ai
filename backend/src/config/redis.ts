import { Redis } from 'ioredis';
import { config } from './index';

let redis: Redis;

try {
  redis = new Redis(config.redis.url, {
    maxRetriesPerRequest: null,
    lazyConnect: true,
  });
  redis.on('connect', () => console.log('✅ Redis connected'));
  redis.on('error', (err) => console.warn('⚠️  Redis error:', err.message));
} catch {
  console.warn('⚠️  Redis not available — queue features disabled');
  redis = {} as Redis;
}

export { redis };
