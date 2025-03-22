import { AuthGuard } from './../../guards/auth.guard';
import { EnvType } from './../../common/common.enum';
import { InfrastructureModule } from '../../infra/infrastructure';
import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import authConfig from 'apps/api/common/configs/auth.config';
import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === EnvType.DEVELOPMENT ? '.env.dev' : '.env',
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: authConfig.jwtConstants.secretKeyToken,
      signOptions: { expiresIn: '24h' },
    }),
    InfrastructureModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
