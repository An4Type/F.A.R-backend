import { IsEmail } from 'class-validator';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as argon2 from 'argon2';

export type UserProps = {
  username: string;
  email: string;
  password: string;
  id?: number;
};

@Entity()
export class User {
  static fromProps({ username, email, password, id }: UserProps) {
    const user = new User();
    user.username = username;
    user.email = email;
    user.password = password;
    if (id) user.id = id;
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

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password, {
      secret: Buffer.from(process.env.ARGON_PASS),
    });
  }
}
