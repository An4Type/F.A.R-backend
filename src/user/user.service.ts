import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import * as argon2 from 'argon2';
import { ResponseUserDto } from './dto/response-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { validate } from 'class-validator';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createUser(userDto: CreateUserDto): Promise<ResponseUserDto> {
    const { email, password, username } = userDto;

    if (await this.validateUserExisting({ username, email }))
      throw new HttpException('User already exist', HttpStatus.BAD_REQUEST);

    const newUser: User = User.fromProps({
      username: username,
      email: email,
      password: password,
    });

    const errors = await validate(newUser);

    if (errors.length > 0) {
      throw new HttpException(
        'User data validation failed',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const savedUser = await this.userRepository.save(newUser);
      return this.buildResponseUser(savedUser);
    }
  }

  async login(userDto: LoginUserDto): Promise<ResponseUserDto> {
    const { usernameOrEmail, password } = userDto;
    const user = await this.verifyUser({ usernameOrEmail, password });
    return this.buildResponseUser(user);
  }

  async validateUserExisting({
    username,
    email,
  }: {
    username: string;
    email: string;
  }): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });
    return !!user;
  }

  async verifyUser({
    usernameOrEmail,
    password,
  }: {
    usernameOrEmail: string;
    password: string;
  }): Promise<User> {
    const user = await this.userRepository.findOne({
      where: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    if (!user)
      throw new HttpException(
        'User with given email/username not found',
        HttpStatus.BAD_REQUEST,
      );
    if (
      await argon2.verify(user.password, password, {
        secret: Buffer.from(process.env.ARGON_PASS),
      })
    )
      return user;
    throw new HttpException(
      'Username/email or password is not correct',
      HttpStatus.UNAUTHORIZED,
    );
  }

  async findById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user)
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);

    return user;
  }

  generateJwt(user: User) {
    const now = new Date();
    const expired = new Date(now);
    expired.setDate(now.getDate() + 60);

    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
        expired: expired,
      },
      process.env.JWT_PASS,
    );
  }

  buildResponseUser(user: User): ResponseUserDto {
    const responseUser: ResponseUserDto = {
      email: user.email,
      username: user.username,
      token: this.generateJwt(user),
    };
    return responseUser;
  }
}
