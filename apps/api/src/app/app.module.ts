import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { CombineModule } from '../modules/combine.module';
import authConfig from '../common/configs/auth.config';
import { envFilePath } from '../common/configs/defaultConfig';
import { InfrastructureModule } from '../infra/infrastructure';
import { ServicesModule } from '../services/services.module';
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
    ServicesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
  ],
})
export class AppModule {}
