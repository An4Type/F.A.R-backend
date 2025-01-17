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
};

@Entity()
export class FoodConsumed {
  static fromProps({ id, food, mass, dayInfo }: FoodConsumedProps) {
    const foodConsumed = new FoodConsumed();
    foodConsumed.food = food;
    foodConsumed.mass = mass;
    foodConsumed.dayInfo = dayInfo;
    if (id) foodConsumed.id = id;
    return foodConsumed;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  mass: number;

  @OneToOne(() => Food)
  @JoinColumn()
  food: Food;

  @ManyToOne(() => DayInfo, (dayInfo) => dayInfo.foodConsumed)
  dayInfo: DayInfo;

  @Column(() => Nutrition)
  nutrition: Nutrition;

  @BeforeInsert()
  calculateNutrition() {
    const nutrition = this.food.nutrition;
    Object.keys(nutrition).forEach((key) => nutrition[key] * this.mass);
    this.nutrition = Nutrition.fromProps({ ...nutrition });
  }
}
