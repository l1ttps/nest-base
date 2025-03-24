import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { Public } from 'apps/api/src/guards/auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getWelcome() {
    return this.appService.getWelcome();
  }
}
