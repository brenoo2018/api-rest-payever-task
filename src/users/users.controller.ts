import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('api')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/users')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get('/user/:id')
  findUserById(@Param('id') id: string) {
    return this.usersService.findUserById(+id);
  }
  @Get('/user/:id/avatar')
  getAvatar(@Param('id') id: string) {
    return this.usersService.getAvatar(+id);
  }

  @Delete('user/:id/avatar')
  removeAvatar(@Param('id') id: string) {
    return this.usersService.removeAvatar(+id);
  }
}
