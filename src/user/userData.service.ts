import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateFoodConsumedDto } from 'src/food/dto/create-foodConsumed.dto';
import { DayService } from 'src/dayInfo/day.service';
import { FoodService } from 'src/food/food.service';

@Injectable()
export class UserDataService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject() private readonly foodService: FoodService,
    @Inject() private readonly dayService: DayService,
  ) {}

  async addFoodConsumed(foodConsumedDto: CreateFoodConsumedDto, user: User) {
    const fullUser = await this.userRepository.findOne({
      where: { id: user.id },
      relations: { dayInfos: { foodConsumed: true, goal: true } },
    });
    const foodConsumed =
      await this.foodService.getCreatedFoodConsumed(foodConsumedDto);

    if (
      fullUser.dayInfos.length > 0 &&
      fullUser.dayInfos.at(-1).date.toString() ==
        new Date().toISOString().split('T')[0]
    ) {
      fullUser.dayInfos.at(-1).foodConsumed.push(foodConsumed);
      fullUser.dayInfos.at(-1).calculateNutrition();
    } else {
      const dayInfo = await this.dayService.getCreatedDayInfoForUser(user);
      dayInfo.foodConsumed.push(foodConsumed);
      fullUser.dayInfos.push(dayInfo);
    }
    await this.userRepository.save(fullUser);
    return fullUser.dayInfos.at(-1);
  }
}
