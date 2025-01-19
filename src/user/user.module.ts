import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserDataService } from './userData.service';
import { FoodService } from 'src/food/food.service';
import { DayService } from 'src/dayInfo/day.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), FoodService, DayService],
  controllers: [UserController],
  providers: [UserService, UserDataService],
  exports: [UserService],
})
export class UserModule {}
