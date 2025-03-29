import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ConfigEntity } from './entities/config.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SystemConfigsService {
  constructor(
    @InjectRepository(ConfigEntity)
    private readonly configRepository: Repository<ConfigEntity>
  ) {}
}
