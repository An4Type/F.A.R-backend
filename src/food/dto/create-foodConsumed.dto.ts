import { IsNotEmpty, IsNumber, IsNumberString } from 'class-validator';
import { Food } from '../entities/food.entity';

export class CreateFoodConsumedDto {
  @IsNotEmpty()
  @IsNumberString()
  mass: number;

  @IsNotEmpty()
  food: Food;
}
