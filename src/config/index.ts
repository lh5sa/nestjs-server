import app from './app.config';
import database from './database.config';
import jwt from './jwt.config';
import upload from './upload.config';
export const configs = [
  app,
  jwt,
  database, // 数据库
  upload,
];
