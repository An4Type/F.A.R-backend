import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Goal } from './goal.entity';
import { Nutrition } from 'src/food/entities/nutrition';
import { FoodConsumed } from 'src/food/entities/foodConsumed.entity';

export type DayInfoProps = {
  id?: number;
  nutrition: Nutrition;
  date?: Date;
  goal: Goal;
  user: User;
  foodConsumed?: FoodConsumed[];
};

@Entity()
export class DayInfo {
  static fromProps({
    id,
    nutrition,
    date,
    goal,
    foodConsumed,
    user,
  }: DayInfoProps) {
    const dayInfo = new DayInfo();
    dayInfo.nutrition = nutrition;
    dayInfo.goal = goal;
    dayInfo.user = user;
    dayInfo.date = date ?? new Date();
    dayInfo.foodConsumed = foodConsumed ?? [];
    if (id) dayInfo.id = id;
    return dayInfo;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column(() => Nutrition)
  nutrition: Nutrition;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  date: Date;

  @ManyToOne(() => Goal, (goal) => goal.dayInfos)
  goal: Goal;

  @ManyToOne(() => User, (user) => user.dayInfos)
  user: User;

  @OneToMany(() => FoodConsumed, (foodConsumed) => foodConsumed.dayInfo)
  foodConsumed: FoodConsumed[];
}
