import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { DayService } from './day.service';
import { AuthGuard } from 'src/guard/auth.guard';
import { UserData } from 'src/guard/userData.decorator';
import { User } from 'src/user/entities/user.entity';
import { DayInfo } from './entity/dayInfo.entity';
import { Nutrition } from 'src/food/entities/nutrition';

type data = {
  dayInfo: DayInfo;
  goalDto: Nutrition;
};

@Controller('day')
export class DayController {
  constructor(private readonly dayService: DayService) {}

  @UseGuards(AuthGuard)
  @Get('/getUserDayInfoList')
  getUserDayInfoList(@UserData() user: User) {
    return this.dayService.getDayInfoListFromUser(user);
  }

  @Patch('/setGoalToDayInfo')
  async setGoalToDayInfo(@Body() data: data) {
    await this.dayService.setNewGoal(data.dayInfo, data.goalDto);
    return HttpStatus.ACCEPTED;
  }
}
