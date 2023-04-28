import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('api')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/users')
  public async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get('/user/:id')
  public async findUserById(@Param('id') id: string) {
    return this.usersService.findUserById(+id);
  }
  @Get('/user/:id/avatar')
  public async getAvatar(@Param('id') id: string) {
    return this.usersService.getAvatar(+id);
  }

  @Delete('user/:id/avatar')
  public async removeAvatar(@Param('id') id: string) {
    return this.usersService.removeAvatar(+id);
  }
}
