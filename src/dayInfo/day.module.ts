import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Food } from 'src/food/entities/food.entity';
import { DayInfo } from './entity/dayInfo.entity';
import { Goal } from './entity/goal.entity';
import { FoodConsumed } from 'src/food/entities/foodConsumed.entity';
import { DayController } from './day.controller';
import { DayService } from './day.service';
import { User } from 'src/user/entities/user.entity';
import { FoodModule } from 'src/food/food.module';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([DayInfo, User]), FoodModule],
  controllers: [DayController],
  providers: [DayService, UserService],
  exports: [DayService],
})
export class DayModule {}
