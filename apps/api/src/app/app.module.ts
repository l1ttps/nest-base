import { AuthGuard } from '../guards/auth.guard';
import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { CombineModule } from '../modules/combine.module';
import authConfig from '../common/configs/auth.config';
import { envFilePath } from '../common/configs/defaultConfig';
import { InfrastructureModule } from '../infra/infrastructure';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envFilePath,
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
