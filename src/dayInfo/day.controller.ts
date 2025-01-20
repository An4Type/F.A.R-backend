import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Patch,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { DayService } from './day.service';
import { AuthGuard } from 'src/guard/auth.guard';
import { UserData } from 'src/guard/userData.decorator';
import { User } from 'src/user/entities/user.entity';
import { DayInfo } from './entity/dayInfo.entity';
import { Nutrition } from 'src/food/entities/nutrition';
import { ClassValidatorPipe } from 'src/pipes/validation.pipe';
import { SetGoalDto } from './dto/set-goal.dto';

@Controller('day')
export class DayController {
  constructor(private readonly dayService: DayService) {}

  @UseGuards(AuthGuard)
  @Get('/getUserDayInfoList')
  getUserDayInfoList(@UserData() user: User) {
    return this.dayService.getDayInfoListFromUser(user);
  }

  @UsePipes(new ClassValidatorPipe())
  @UseGuards(AuthGuard)
  @Patch('/setGoalToDayInfo')
  async setGoalToDayInfo(@UserData() user: User, @Body() goalDto: SetGoalDto) {
    await this.dayService.setNewGoal(goalDto.dayInfoId, user, goalDto.goalDto);
    return HttpStatus.ACCEPTED;
  }

  @UseGuards(AuthGuard)
  @Get('/getCurrentDayInfo')
  getCurrentDayInfo(@UserData() user: User) {
    return this.dayService.getCurrentDayInfoFromUser(user);
  }
}
