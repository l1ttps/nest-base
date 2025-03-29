import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigsModule } from './configs/configs.module';
@Module({
  imports: [UsersModule, AuthModule, ConfigsModule],
  providers: [],
  exports: [],
})
export class CombineModule {}
