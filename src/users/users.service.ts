import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { validate } from 'class-validator';
import { PrismaService } from 'src/prisma.service';
import { RabbitService } from 'src/rmq/rmq.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly rabbitService: RabbitService,
  ) {}
  async createUser(data: CreateUserDto) {
    const errors = await validate(data);
    const isContainsErrors = errors.length > 0;
    if (isContainsErrors) {
      throw new BadRequestException(errors);
    }

    const findUser = await this.prismaService.user.findUnique({
      where: { email: data.email },
    });

    if (findUser) {
      throw new BadRequestException('User already exists.');
    }

    const user = await this.prismaService.user.create({
      data: data,
    });

    await this.rabbitService.sendMessage({ userId: user.id });

    return { user };
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
