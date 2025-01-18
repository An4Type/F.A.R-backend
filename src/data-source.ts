import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './user/entities/user.entity';
import { Food } from './food/entities/food.entity';
import { FoodConsumed } from './food/entities/foodConsumed.entity';
import { DayInfo } from './dayInfo/entity/dayInfo.entity';
import { Goal } from './dayInfo/entity/goal.entity';

dotenv.config();
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  username: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: Number.parseInt(process.env.POSTGRES_PORT as unknown as string),
  entities: [User, Food, FoodConsumed, DayInfo, Goal],
  synchronize: true,
  migrations: ['src/migrations/**/*.ts'],
});

export const DataSourceOptions = AppDataSource.options;
