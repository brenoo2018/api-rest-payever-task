import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from '../dto/create-user.dto';

export class UserEntity {
  id: string;

  first_name: string;

  last_name: string;

  email: string;

  constructor(user?: CreateUserDto) {
    this.id = user.id;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.email = user.email;
    this.id = user.id;
  }
}
