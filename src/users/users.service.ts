import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { validate } from 'class-validator';
import { PrismaService } from 'src/prisma.service';
import { RabbitService } from 'src/rmq/rmq.service';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '@prisma/client';
import { HttpService } from '@nestjs/axios';

interface ResponseFindUserById {
  data: User;
}

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly rabbitService: RabbitService,
    private readonly mailerService: MailerService,
    private httpService: HttpService,
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

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome!',
      context: { name: user.first_name },
    });

    return { user };
  }

  async findUserById(userId: number): Promise<User> {
    const url = `https://reqres.in/api/users/${userId}`;
    try {
      const { data } =
        await this.httpService.axiosRef.get<ResponseFindUserById>(url);

      if (!data.data) {
      }
      const user = data.data;

      return user;
    } catch (error) {
      throw new BadRequestException('User not found.');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
