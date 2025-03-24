export enum EnvType {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export const ADMIN = UserRole.ADMIN;
export const USER = UserRole.USER;

export enum AuthType {
  BASIC = 'BASIC',
  FACEBOOK = 'FACEBOOK',
  GOOGLE = 'GOOGLE',
}
