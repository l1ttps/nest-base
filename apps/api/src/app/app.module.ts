import { AuthGuard } from './../../guards/auth.guard';
import { InfrastructureModule } from '../../infra/infrastructure';
import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import authConfig from 'apps/api/common/configs/auth.config';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { envFilePath } from 'apps/api/common/configs/defaultConfig';
import { CombineModule } from '../modules/combine.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: authConfig.jwtConstants.secretKeyToken,
      signOptions: { expiresIn: '24h' },
    }),
    InfrastructureModule,
    CombineModule,
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
