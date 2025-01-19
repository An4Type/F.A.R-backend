import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserDataService } from './userData.service';
import { FoodModule } from 'src/food/food.module';
import { DayModule } from 'src/dayInfo/day.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), FoodModule, DayModule],
  controllers: [UserController],
  providers: [UserService, UserDataService],
  exports: [UserService],
})
export class UserModule {}
