import 'dotenv/config';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  synchronize: false,
  database: process.env.DB_DATABASE,
  entities: ['src/**/entity/*.ts'],
  migrations: ['src/migration/*.ts'],
  logging: true,
});
