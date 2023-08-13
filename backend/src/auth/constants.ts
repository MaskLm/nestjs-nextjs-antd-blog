export const jwtAccessConstants = {
  secret: process.env.JWT_ACCESS_SECRET,
  expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '1m',
};

export const jwtRefreshConstants = {
  secret: process.env.JWT_REFRESH_SECRET,
  expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
};
