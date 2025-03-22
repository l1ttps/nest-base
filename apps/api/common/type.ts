import { JwtPayload } from 'jsonwebtoken';
import { CrudOptions } from '@dataui/crud';
import { UserRole } from './common.enum';

type UnwantedKeys = 'model';
export type CrudOptionsType = Omit<CrudOptions, UnwantedKeys>;

export type ControllerCrudOptions = {
  name: string;
  entity: any;
  crud?: CrudOptionsType;
};

export interface TokenPayload extends JwtPayload {
  email: string;
  id: string;
  jti: string;
  name?: string;
  role: UserRole;
  remember?: boolean;
  sessionExp?: number;
}

export interface RedisConfigs {
  url?: string;
  host?: string;
  port?: number;
  password?: string | null;
  db?: number;
}
