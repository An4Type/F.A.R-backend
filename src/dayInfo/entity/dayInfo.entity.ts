import { User } from 'src/user/entities/user.entity';
import {
  BeforeInsert,
  BeforeUpdate,
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
  user?: User;
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
    dayInfo.date = date ?? new Date();
    dayInfo.foodConsumed = foodConsumed ?? [];
    if (user) dayInfo.user = user;
    if (id) dayInfo.id = id;
    return dayInfo;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column(() => Nutrition)
  nutrition: Nutrition;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  date: Date;

  @ManyToOne(() => Goal, (goal) => goal.dayInfos, { cascade: true })
  goal: Goal;

  @ManyToOne(() => User, (user) => user.dayInfos)
  user: User;

  @OneToMany(() => FoodConsumed, (foodConsumed) => foodConsumed.dayInfo, {
    cascade: true,
  })
  foodConsumed: FoodConsumed[];

  @BeforeInsert()
  getNutrition() {
    this.calculateNutrition();
  }

  @BeforeUpdate()
  calculateNutrition() {
    if (this.foodConsumed) {
      this.nutrition = this.foodConsumed.reduce((prev, val): Nutrition => {
        return {
          calories: prev.calories + val.nutrition.calories,
          fats: prev.fats + val.nutrition.fats,
          carbohydrates: prev.carbohydrates + val.nutrition.carbohydrates,
          proteins: prev.proteins + val.nutrition.proteins,
        };
      }, Nutrition.createEmpty());
    }
  }
}
