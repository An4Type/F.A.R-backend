import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/guard/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ClassValidatorPipe } from 'src/pipes/validation.pipe';
import { UserDataService } from './userData.service';
import { CreateFoodConsumedDto } from 'src/food/dto/create-foodConsumed.dto';
import { UserData } from 'src/guard/userData.decorator';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userDataService: UserDataService,
  ) {}

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

  @UseGuards(AuthGuard)
  @Post('/addFoodConsumed')
  addFoodConsumed(
    @UserData() user: User,
    @Body() foodConsumedDto: CreateFoodConsumedDto,
  ) {
    return this.userDataService.addFoodConsumed(foodConsumedDto, user);
  }
}
