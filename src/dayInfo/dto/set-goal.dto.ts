import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Nutrition } from 'src/food/entities/nutrition';

export class SetGoalDto {
  @IsNotEmpty()
  dayInfoId: number;

  @ValidateNested()
  @IsNotEmpty()
  @Type(() => Nutrition)
  goalDto: Nutrition;
}
