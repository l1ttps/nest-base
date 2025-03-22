import { EnvType } from './../../common/common.enum';
import { DatabaseModule } from './../../database/database.module';
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${
        process.env.NODE_ENV === EnvType.DEVELOPMENT ? '.env.dev' : '.env'
      }`,
      isGlobal: true,
    }),
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
