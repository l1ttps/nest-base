import authConfig from './auth.config';
import { crudConfig } from './crud.config';

const APPLICATION_NAME = 'Nest Base';
const DEFAULT_CACHE_TTL = 2000;
const PASSWORD_EXAMPLE = '$uperP4$$W0rd';
const API_PREFIX = 'api';

const TOKEN_TTL = 24 * 60 * 60;
const REFRESH_TOKEN_TTL = 30 * 24 * 60 * 60;
export {
  crudConfig,
  authConfig,
  APPLICATION_NAME,
  DEFAULT_CACHE_TTL,
  PASSWORD_EXAMPLE,
  API_PREFIX,
  REFRESH_TOKEN_TTL,
  TOKEN_TTL,
};

export const envFilePath = `.env.${process.env.NODE_ENV}`;
