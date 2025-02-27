import { Expose } from 'class-transformer';
import { FoodCategory } from '../entities/food.entity';
import { Nutrition } from '../entities/nutrition';

export type FoodResponseLightProps = {
  id: number;
  name?: string;
  canName: string;
  category: FoodCategory;
  nutrition: Nutrition;
  info: string;
};

export class FoodResponseLight {
  static fromProps({
    id,
    name,
    canName,
    nutrition,
    category,
    info,
  }: FoodResponseLight) {
    const foodDto = new FoodResponseLight();
    foodDto.name = name;
    foodDto.canName = canName;
    foodDto.info = info;
    foodDto.nutrition = nutrition;
    foodDto.category = category;
    foodDto.id = id;
    return foodDto;
  }

  @Expose()
  id: number;
  @Expose()
  name?: string;
  @Expose()
  canName: string;
  @Expose()
  category: FoodCategory;
  @Expose()
  nutrition: Nutrition;
  @Expose()
  info: string;
}
