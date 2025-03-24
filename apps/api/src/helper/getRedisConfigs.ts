import { ConfigService } from '@nestjs/config';
import { RedisConfigs } from '../common/type';
export default function getRedisConfigs(
  configs: ConfigService
): RedisConfigs | null {
  const host = configs.get<string>('REDIS_HOST');
  const port = configs.get<number>('REDIS_PORT');
  const password = configs.get<string>('REDIS_PASSWORD') || null;
  const db = configs.get<number>('REDIS_DB') || 0; // Use database 0 by default
  if (!host && !port) {
    return null;
  }
  const url = `redis://${host}:${port}/${db}`;
  return {
    url,
    host,
    port,
    password,
    db,
  };
}
