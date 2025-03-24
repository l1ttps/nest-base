import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as requestIp from 'request-ip';

export const UserContext = createParamDecorator(
  (_: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { headers } = request;
    const token = headers['authorization'];
    const tokenPayload = jwt.decode(token) || {};
    return {
      ...(tokenPayload as object),
      metadata: {
        userAgent: headers['user-agent'],
        ipAddress: requestIp.getClientIp(request),
      },
    };
  }
);
