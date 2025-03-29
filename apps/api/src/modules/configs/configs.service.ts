import { Injectable, OnModuleInit } from '@nestjs/common';
import { Entity, Repository } from 'typeorm';
import { Config } from './entities/config.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { omit } from 'lodash';
@Entity('configs')
@Injectable()
export class SystemConfigsService implements OnModuleInit {
  private swagger;
  constructor(
    @InjectRepository(Config)
    private readonly repo: Repository<Config>
  ) {}

  async onModuleInit() {
    await this.getGlobalConfigs();
  }

  /**
   * Retrieves raw configuration values from the database
   * @param keys - Array of configuration keys to retrieve. If empty, returns all configs
   * @returns Promise containing partial Config object with requested keys
   */
  public async getRawConfigs<T extends keyof Config>(
    ...keys: T[]
  ): Promise<Partial<Config>> {
    const columns =
      keys.length > 0 ? keys.map((k) => `"${k}"`).join(', ') : '*';

    const query = () =>
      this.repo.query(`
        SELECT ${columns} FROM configs
        ORDER BY "createdAt" DESC
        LIMIT 1
      `);

    let configs = await query();

    if (configs.length === 0) {
      const newConfigs = new Config();
      await this.repo.save(newConfigs);
      configs = await query();
    }
    return configs[0];
  }

  /**
   * Retrieves and transforms global configuration settings
   * @returns Promise containing mapped configuration object where each key has a value property
   * @throws Logs error to console if operation fails
   */
  public async getGlobalConfigs(): Promise<any> {
    try {
      const rawData = await this.getRawConfigs().then((res) =>
        omit(res, ['updatedAt', 'createdAt', 'id'])
      );

      const mappedData = Object.keys(rawData).reduce((obj, key) => {
        let value = rawData[key];
        obj[key] = {
          value,
        };
        return obj;
      }, {});

      console.log(mappedData);
      return mappedData;
    } catch (e) {
      console.log(e);
    }
  }
}
