import { Nutrition } from 'src/food/entities/nutrition';
import { Goal } from '../entity/goal.entity';
import { User } from 'src/user/entities/user.entity';
import { FoodConsumed } from 'src/food/entities/foodConsumed.entity';
import { FoodConsumedResponseLight } from 'src/food/dto/foodConsumed-response-light.dto';
import { GoalResponseLight } from './goal-response-light.dto';
import { Expose, Type } from 'class-transformer';

export type DayInfoResponseLightProps = {
  id?: number;
  nutrition: Nutrition;
  date?: Date;
  goal: GoalResponseLight;
  foodConsumed?: FoodConsumedResponseLight[];
};

export class DayInfoResponseLight {
  static fromProps({
    id,
    nutrition,
    date,
    goal,
    foodConsumed,
  }: DayInfoResponseLightProps) {
    const dayInfo = new DayInfoResponseLight();
    dayInfo.nutrition = nutrition;
    dayInfo.goal = goal;
    dayInfo.date = date ?? new Date();
    dayInfo.foodConsumed = foodConsumed ?? [];
    dayInfo.id = id;
    return dayInfo;
  }

  @Expose()
  id: number;
  @Expose()
  nutrition: Nutrition;
  @Expose()
  date: Date;
  @Expose()
  @Type(() => GoalResponseLight)
  goal: GoalResponseLight;
  @Expose()
  @Type(() => FoodConsumedResponseLight)
  foodConsumed: FoodConsumedResponseLight[];
}
