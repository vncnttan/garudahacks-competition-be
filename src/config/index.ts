import dotenv from 'dotenv';
dotenv.config();

export const {
    NODE_ENV,
    PORT,
    DB_URL,
    FRONTEND_URL,
    JWT_SECRET,
  } = process.env;