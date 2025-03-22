const authConfig = {
  jwtConstants: {
    secretKeyToken: process.env.SECRET_KEY_TOKEN || "TokenSuperSecret123!@#",
    secretKeyRefreshToken:
      process.env.SECRET_KEY_REFRESH_TOKEN || "RefreshTokenSuperSecret123!@#",
  },
};

export default authConfig;
