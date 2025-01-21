import { Expose } from 'class-transformer';
import { Nutrition } from 'src/food/entities/nutrition';

export type GoalResponseLightProps = {
  id: number;
  nutrition: Nutrition;
};

export class GoalResponseLight {
  static fromProps({ id, nutrition }: GoalResponseLightProps) {
    const goal = new GoalResponseLight();
    goal.nutrition = nutrition;
    goal.id = id;
    return goal;
  }
  @Expose()
  id: number;
  @Expose()
  nutrition: Nutrition;
}
