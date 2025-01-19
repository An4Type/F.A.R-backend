import { Controller, Get, HttpStatus, Patch, UseGuards } from '@nestjs/common';
import { DayService } from './day.service';
import { AuthGuard } from 'src/guard/auth.guard';
import { UserData } from 'src/guard/userData.decorator';
import { User } from 'src/user/entities/user.entity';
import { DayInfo } from './entity/dayInfo.entity';
import { Nutrition } from 'src/food/entities/nutrition';

@Controller('day')
export class DayController {
  constructor(private readonly dayService: DayService) {}

  @UseGuards(AuthGuard)
  @Get('/getUserDayInoList')
  getUserDayInfoList(@UserData() user: User) {
    return this.dayService.getDayInfoListFromUser(user);
  }

  @Patch('/setGoalToDayInfo')
  async setGoalToDayInfo(dayInfo: DayInfo, goalDto: Nutrition) {
    await this.dayService.setNewGoal(dayInfo, goalDto);
    return HttpStatus.ACCEPTED;
  }
}
