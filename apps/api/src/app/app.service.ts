import { Injectable } from '@nestjs/common';
import { APPLICATION_NAME } from 'apps/api/common/configs/defaultConfig';

@Injectable()
export class AppService {
  getWelcome(): { message: string } {
    return { message: `Welcome to ${APPLICATION_NAME}` };
  }
}
