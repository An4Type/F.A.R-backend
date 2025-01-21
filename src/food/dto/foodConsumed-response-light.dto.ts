import { Expose, Type } from 'class-transformer';
import { FoodConsumed } from '../entities/foodConsumed.entity';
import { Nutrition } from '../entities/nutrition';
import { FoodResponseLight } from './food-response-light.dto';

export type FoodConsumedResponseLightProps = {
  id: number;
  food: FoodResponseLight;
  mass: number;
};

export class FoodConsumedResponseLight {
  static fromProps({ id, food, mass }: FoodConsumedResponseLightProps) {
    const foodConsumed = new FoodConsumedResponseLight();
    foodConsumed.food = food;
    foodConsumed.nutrition = FoodConsumed.calculateNutrition(
      food.nutrition,
      mass,
    );
    foodConsumed.mass = mass;
    foodConsumed.id = id;
    return foodConsumed;
  }

  @Expose()
  id: number;
  @Expose()
  @Type(() => FoodResponseLight)
  food: FoodResponseLight;
  @Expose()
  mass: number;
  @Expose()
  nutrition: Nutrition;
}
