import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Nutrition } from './nutrition';

export enum FoodCategory {
  MEAT = 'Meat',
  DESSERT = 'Dessert',
  SALAD = 'Salad',
  APPETIZER = 'Appetizer',
  MAIN_DISH = 'Main Dish',
  SOUP = 'Soup',
  SNACK = 'Snack',
  SIDE_DISH = 'Side Dish',
  BEVERAGE = 'Beverage',
  BREAKFAST = 'Breakfast',
}

export type FoodProps = {
  id?: number;
  name?: string;
  canName: string;
  category: FoodCategory;
  nutrition: Nutrition;
  info: string;
  photo: Buffer;
};

@Entity()
export class Food {
  static fromProps({
    id,
    name,
    canName,
    nutrition,
    category,
    info,
    photo,
  }: FoodProps) {
    const food = new Food();
    food.name = name
      ? name
      : canName
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (char) => char.toUpperCase());
    food.canName = canName;
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
  name?: string;

  @Column()
  canName: string;

  @Column()
  info: string;

  @Column('bytea')
  photo: Buffer;

  @Column(() => Nutrition)
  nutrition: Nutrition;

  @Column({ type: 'enum', enum: FoodCategory, default: FoodCategory.MEAT })
  category: FoodCategory;
}
