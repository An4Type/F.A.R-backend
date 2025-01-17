import { Column } from 'typeorm';

export type NutritionProps = {
  calories: number;
  fats: number;
  carbohydrates: number;
  proteins: number;
};

export class Nutrition {
  static fromProps({
    calories,
    fats,
    carbohydrates,
    proteins,
  }: NutritionProps) {
    const nutrition = new Nutrition();
    nutrition.calories = calories;
    nutrition.carbohydrates = carbohydrates;
    nutrition.fats = fats;
    nutrition.proteins = proteins;
    return nutrition;
  }

  static createEmpty() {
    return this.fromProps({
      calories: 0,
      fats: 0,
      carbohydrates: 0,
      proteins: 0,
    });
  }
  @Column()
  calories: number;

  @Column()
  fats: number;

  @Column()
  carbohydrates: number;

  @Column()
  proteins: number;
}
