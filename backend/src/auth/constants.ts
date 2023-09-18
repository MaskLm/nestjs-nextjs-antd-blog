export const jwtAccessConstants = {
  secret: process.env.JWT_ACCESS_SECRET,
  expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '1m',
};

export const jwtRefreshConstants = {
  secret: process.env.JWT_REFRESH_SECRET,
  expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
};

export const jwtAccountInfoProtectConstants = {
  secret: process.env.JWT_ACCOUNT_INFO_PROTECT_SECRET,
  expiresIn: process.env.JWT_ACCOUNT_INFO_PROTECT_EXPIRES_IN || '1m',
};
