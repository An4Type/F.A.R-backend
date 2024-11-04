import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/guard/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ClassValidatorPipe } from 'src/pipes/validation.pipe';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UsePipes(new ClassValidatorPipe())
  @Post('/login')
  async login(@Body() user: LoginUserDto) {
    return this.userService.login(user);
  }

  @UsePipes(new ClassValidatorPipe())
  @Post()
  async create(@Body() user: CreateUserDto) {
    return this.userService.createUser(user);
  }
}
