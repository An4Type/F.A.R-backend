import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Food } from './food.entity';
import { DayInfo } from 'src/dayInfo/entity/dayInfo.entity';
import { Nutrition } from './nutrition';

export type FoodConsumedProps = {
  id?: number;
  food: Food;
  mass: number;
  dayInfo?: DayInfo;
  nutrition?: Nutrition;
};

@Entity()
export class FoodConsumed {
  static fromProps({ id, food, mass, dayInfo }: FoodConsumedProps) {
    const foodConsumed = new FoodConsumed();
    foodConsumed.food = food;
    foodConsumed.nutrition = this.calculateNutrition(food.nutrition, mass);
    foodConsumed.mass = mass;
    foodConsumed.dayInfo = dayInfo;
    if (id) foodConsumed.id = id;
    return foodConsumed;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  mass: number;

  @ManyToOne(() => Food)
  @JoinColumn()
  food: Food;

  @ManyToOne(() => DayInfo, (dayInfo) => dayInfo.foodConsumed)
  dayInfo: DayInfo;

  @Column(() => Nutrition)
  nutrition: Nutrition;

  static calculateNutrition(nutrition: Nutrition, mass: number) {
    const newNutrition = Object.assign({}, nutrition);
    Object.keys(nutrition).forEach((key) => (newNutrition[key] *= mass / 100));
    return Nutrition.fromProps({ ...newNutrition });
  }
}
