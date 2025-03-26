import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { Public } from 'apps/api/src/guards/auth.guard';
import { ApiExcludeEndpoint, ApiProperty, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiExcludeEndpoint()
  @Public()
  @Get()
  getWelcome() {
    return this.appService.getWelcome();
  }
}
