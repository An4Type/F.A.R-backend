import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFoodConsumedDto } from 'src/food/dto/create-foodConsumed.dto';
import { FoodConsumed } from 'src/food/entities/foodConsumed.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { DayInfo } from './entity/dayInfo.entity';
import { Nutrition } from 'src/food/entities/nutrition';
import { Goal } from './entity/goal.entity';
import { FoodService } from 'src/food/food.service';

@Injectable()
export class DayService {
  constructor(
    @InjectRepository(FoodConsumed)
    private readonly foodConsumedRepository: Repository<FoodConsumed>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(DayInfo)
    private readonly dayInfoRepository: Repository<DayInfo>,
    @Inject() private readonly foodService: FoodService,
  ) {}

  async getCreatedDayInfoForUser(user: User) {
    const date = new Date().toISOString().split('T')[0] as unknown as Date;
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

  async setNewGoal(dayInfo: DayInfo, goalDto: Nutrition) {
    const checkDayInfo = this.dayInfoRepository.findOne({
      where: { id: dayInfo.id },
    });
    if (!checkDayInfo)
      throw new HttpException(
        `DayInfo with given id wasn't found`,
        HttpStatus.BAD_REQUEST,
      );
    dayInfo.goal = Goal.fromProps({ nutrition: goalDto });
    await this.dayInfoRepository.save(dayInfo.goal);
  }
}
