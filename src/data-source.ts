import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './user/entities/user.entity';

dotenv.config();
const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  username: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
  entities: [User],
  synchronize: true,
});

export const DataSourceOptions = AppDataSource.options;
