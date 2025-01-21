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
import { ClassValidatorPipe } from 'src/pipes/validation.pipe';
import { SetGoalDto } from './dto/set-goal.dto';
import { DayInfoResponseLight } from './dto/dayInfo-response-light.dto';
import { plainToInstance } from 'class-transformer';

@Controller('day')
export class DayController {
  constructor(private readonly dayService: DayService) {}

  @UseGuards(AuthGuard)
  @Get('/getUserDayInfoList')
  getUserDayInfoList(@UserData() user: User) {
    return this.dayService.getDayInfoListFromUser(user);
  }

  @UseGuards(AuthGuard)
  @Get('/getUserDayInfoListLight')
  async getUserDayInfoListLight(@UserData() user: User) {
    const lightDayInfos: DayInfoResponseLight[] = plainToInstance(
      DayInfoResponseLight,
      await this.dayService.getDayInfoListFromUser(user),
      {
        excludeExtraneousValues: true,
      },
    );
    return lightDayInfos;
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

  @UseGuards(AuthGuard)
  @Get('/getCurrentDayInfoLight')
  async getCurrentDayInfoLight(@UserData() user: User) {
    const lightDayInfo: DayInfoResponseLight = plainToInstance(
      DayInfoResponseLight,
      await this.dayService.getCurrentDayInfoFromUser(user),
      {
        excludeExtraneousValues: true,
      },
    );
    return lightDayInfo;
  }
}
