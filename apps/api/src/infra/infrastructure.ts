import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { DEFAULT_CACHE_TTL } from '../common/configs/defaultConfig';
import getRedisConfigs from '../helper/getRedisConfigs';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        port: configService.get('DB_PORT'),
        host: configService.get('DB_HOST'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity.{js,ts}'],
        synchronize: true,
        ssl: Boolean(configService.get('DB_SSL') === 'true'),
      }),
    }),
    CacheModule.registerAsync({
      isGlobal: true,

      inject: [ConfigService],
      useFactory: async (configs: ConfigService) => {
        const redisConfigs = getRedisConfigs(configs);
        // Use Redis or In-memory cache
        if (redisConfigs) {
          return {
            isGlobal: true,
            store: redisStore,
            ttl: DEFAULT_CACHE_TTL,
            max: 1000,
            ...redisConfigs,
          };
        }
        return {
          isGlobal: true,
        };
      },
    }),
  ],
})
export class InfrastructureModule {}
