import { IsEmail } from 'class-validator';
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as argon2 from 'argon2';
import { DayInfo } from 'src/dayInfo/entity/dayInfo.entity';

export type UserProps = {
  username: string;
  email: string;
  password: string;
  dayInfos?: DayInfo[];
  id?: number;
};

@Entity()
export class User {
  static fromProps({ username, email, dayInfos, password, id }: UserProps) {
    const user = new User();
    user.username = username;
    user.email = email;
    user.password = password;
    if (id) user.id = id;
    user.dayInfos = dayInfos ?? [];
    return user;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => DayInfo, (dayInfo) => dayInfo.user, { cascade: true })
  dayInfos: DayInfo[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password, {
      secret: Buffer.from(process.env.ARGON_PASS),
    });
  }
}
