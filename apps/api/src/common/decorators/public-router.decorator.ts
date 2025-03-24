import { SetMetadata } from '@nestjs/common';
export const PUBLIC_ROUTER_METADATA = 'PUBLIC_ROUTER_METADATA';

/**
 * Public router
 */
export const Public = () => SetMetadata(PUBLIC_ROUTER_METADATA, true);
