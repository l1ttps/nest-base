import { Controller } from '@nestjs/common';
import { SystemConfigsService } from './configs.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../guards/auth.guard';
import { ADMIN } from '../../common/common.enum';

@ApiBearerAuth()
@ApiTags('Configs')
@Controller('configs')
@Roles(ADMIN)
export class ConfigsController {
  constructor(private readonly systemConfigsService: SystemConfigsService) {}
}
