import dotenv from 'dotenv';
dotenv.config();

const config = {
  NODE_ENV: process.env['NODE_ENV'] || 'development',
  PORT: process.env['PORT'] || 3000,
  MONGODB_URI: process.env['MONGODB_URI'] || 'mongodb://127.0.0.1:27017/massaiConnect',
  JWT_ACCESS_SECRET: process.env['JWT_ACCESS_SECRET'] || 'secret',
  JWT_REFRESH_SECRET: process.env['JWT_REFRESH_SECRET'] || 'secretsecret',
  JWT_ACCESS_EXPIRATION_MINUTES: process.env['JWT_ACCESS_EXPIRATION_MINUTES'] || 3600,
  JWT_REFRESH_EXPIRATION_DAYS: process.env['JWT_REFRESH_EXPIRATION_DAYS'] || 30,
  JWT_RESET_PASSWORD_SECRET: process.env['JWT_RESET_PASSWORD_SECRET'] || 60,
  JWT_RESET_PASSWORD_EXPIRATION_MINUTES: process.env['JWT_RESET_PASSWORD_EXPIRATION_MINUTES'] || 60,
  NODE_MAILER_EMAIL: process.env['NODE_MAILER_EMAIL'] || '',
  NODE_MAILER_EMAIL_PASSWORD: process.env['NODE_MAILER_EMAIL_PASSWORD'] || '',
  CLIENT_URL: process.env['CLIENT_URL'] || 'http://localhost:3000',
};

export default config;
