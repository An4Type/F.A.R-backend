import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DayInfo } from './entity/dayInfo.entity';
import { DayController } from './day.controller';
import { DayService } from './day.service';
import { User } from 'src/user/entities/user.entity';
import { FoodModule } from 'src/food/food.module';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([DayInfo, User]), FoodModule],
  controllers: [DayController],
  providers: [DayService, UserService],
  exports: [DayService],
})
export class DayModule {}
