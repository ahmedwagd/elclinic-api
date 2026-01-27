export default () => ({
  port: parseInt(process.env.PORT || '3030', 10),
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: Number(process.env.JWT_EXP_IN) || '12h',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
    refreshExpiresIn: Number(process.env.JWT_REFRESH_EXP_IN) || '7d',
  },
});
