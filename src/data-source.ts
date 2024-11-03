import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();
const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  username: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
  entities: [],
  synchronize: true,
});

export const DataSourceOptions = AppDataSource.options;
