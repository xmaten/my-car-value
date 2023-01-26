import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Session,
} from '@nestjs/common';

import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';

@Controller('auth')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}
  @Serialize(UserDto)
  @Post('/signup')
  async signUp(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signUp(body.email, body.password);
    session.userId = user.id;

    return user;
  }

  @Serialize(UserDto)
  @Post('/signin')
  async signIn(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signIn(body.email, body.password);
    session.userId = user.id;

    return user;
  }

  @Serialize(UserDto)
  @Post('/signout')
  async signOut(@Session() session: any) {
    session.userId = null;
  }

  @Serialize(UserDto)
  @Get('/whoami')
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Serialize(UserDto)
  @Get('/:id')
  findUser(@Param('id') id: string) {
    return this.usersService.findOne(parseInt(id));
  }

  @Serialize(UserDto)
  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Serialize(UserDto)
  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @Serialize(UserDto)
  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }
}
