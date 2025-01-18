import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Nutrition } from './nutrition';

export enum FoodCategory {
  MEAT = 'Meat',
}

export type FoodProps = {
  id?: number;
  name: string;
  category: FoodCategory;
  nutrition: Nutrition;
  info: string;
  photo: string;
};

@Entity()
export class Food {
  static fromProps({ id, name, nutrition, category, info, photo }: FoodProps) {
    const food = new Food();
    food.name = name;
    food.info = info;
    food.nutrition = nutrition;
    food.photo = photo;
    food.category = category;
    if (id) food.id = id;
    return food;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  info: string;

  @Column()
  photo: string;

  @Column(() => Nutrition)
  nutrition: Nutrition;

  @Column({ type: 'enum', enum: FoodCategory, default: FoodCategory.MEAT })
  category: FoodCategory;
}
