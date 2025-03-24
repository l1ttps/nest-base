import { JwtPayload } from 'jsonwebtoken';

import { UserRole } from './common.enum';

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

export interface UserPayload extends TokenPayload {
  metadata: {
    userAgent: string;
    ipAddress: string;
  };
}
