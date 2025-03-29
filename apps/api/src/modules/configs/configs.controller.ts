import { Controller, Get, UseGuards } from '@nestjs/common';
import { SystemConfigsService } from './configs.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard, Public, Roles } from '../../guards/auth.guard';
import { ADMIN } from '../../common/common.enum';
import { GetGlobalConfigDoc } from './configs.doc';

@ApiBearerAuth()
@ApiTags('Configs')
@Controller('configs')
@Roles(ADMIN)
@UseGuards(AuthGuard)
export class ConfigsController {
  constructor(private readonly systemConfigsService: SystemConfigsService) {}

  @Public()
  @GetGlobalConfigDoc()
  @Get('')
  async getGlobalConfigs() {
    return this.systemConfigsService.getGlobalConfigs();
  }
}
