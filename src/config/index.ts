import dotenv from 'dotenv';
dotenv.config();
console.log(process.env);
export const {
    NODE_ENV,
    PORT,
    DB_URL,
    FRONTEND_URL,
    JWT_SECRET,
  } = process.env;