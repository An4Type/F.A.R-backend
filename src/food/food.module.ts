import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodService } from './food.service';
import { FoodController } from './food.controller';
import { Food } from './entities/food.entity';
import { FoodConsumed } from './entities/foodConsumed.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Food, FoodConsumed])],
  controllers: [FoodController],
  providers: [FoodService],
  exports: [FoodService],
})
export class FoodModule {}
