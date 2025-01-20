import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { DayInfo } from './entity/dayInfo.entity';
import { Nutrition } from 'src/food/entities/nutrition';
import { Goal } from './entity/goal.entity';

@Injectable()
export class DayService {
  constructor(
    @InjectRepository(DayInfo)
    private readonly dayInfoRepository: Repository<DayInfo>,
  ) {}

  async getCreatedDayInfoForUser(user: User) {
    const date = this.getCurrentDate();
    const checkDayInfo = await this.dayInfoRepository.findOne({
      where: { user: { id: user.id }, date: date },
    });
    if (checkDayInfo)
      throw new HttpException(
        'DayInfo is already created for this date',
        HttpStatus.BAD_REQUEST,
      );
    const userDayInfos = await this.dayInfoRepository.find({
      where: { user: { id: user.id } },
      relations: { goal: true },
    });
    const goal =
      userDayInfos.length > 0
        ? userDayInfos.at(-1).goal
        : Goal.fromProps({ nutrition: Nutrition.createEmpty() });
    const dayInfo = DayInfo.fromProps({
      nutrition: Nutrition.createEmpty(),
      date: date,
      goal,
      user,
      foodConsumed: [],
    });

    return dayInfo;
  }

  async getDayInfoListFromUser(user: User) {
    const userDayInfos = await this.dayInfoRepository.find({
      where: { user: { id: user.id } },
      relations: { goal: true, foodConsumed: { food: true } },
    });

    return userDayInfos;
  }

  async getCurrentDayInfoFromUser(user: User) {
    const userDayInfos = await this.dayInfoRepository.find({
      where: { user: { id: user.id } },
      relations: { goal: true, foodConsumed: { food: true } },
    });

    if (
      userDayInfos.length > 0 &&
      userDayInfos.at(-1).date == this.getCurrentDate()
    )
      return userDayInfos.at(-1);
    else
      return DayInfo.fromProps({
        nutrition: Nutrition.createEmpty(),
        date: this.getCurrentDate(),
        goal: Goal.fromProps({
          nutrition:
            userDayInfos.length == 0
              ? Nutrition.createEmpty()
              : userDayInfos.at(-1).goal.nutrition,
        }),
      });
  }

  async setNewGoal(dayInfoId: number, user: User, goalDto: Nutrition) {
    const dayInfo = await this.dayInfoRepository.findOne({
      where: { id: dayInfoId, user: { id: user.id } },
    });
    if (!dayInfo)
      throw new HttpException(
        `DayInfo with given id wasn't found in current user`,
        HttpStatus.BAD_REQUEST,
      );
    dayInfo.goal = Goal.fromProps({ nutrition: goalDto });
    await this.dayInfoRepository.save(dayInfo);
  }

  getCurrentDate(): Date {
    // return '2025-01-21' as unknown as Date;
    return new Date().toISOString().split('T')[0] as unknown as Date;
  }
}
