import { Nutrition } from 'src/food/entities/nutrition';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DayInfo } from './dayInfo.entity';

export type GoalProps = {
  id?: number;
  nutrition: Nutrition;
  dayInfos?: DayInfo[];
};

@Entity()
export class Goal {
  static fromProps({ id, nutrition, dayInfos }: GoalProps) {
    const goal = new Goal();
    goal.nutrition = nutrition;
    goal.dayInfos = dayInfos ?? [];
    if (id) goal.id = id;
    return goal;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column(() => Nutrition)
  nutrition: Nutrition;

  @OneToMany(() => DayInfo, (dayInfo) => dayInfo.goal)
  dayInfos: DayInfo[];
}
