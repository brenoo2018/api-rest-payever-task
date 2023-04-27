import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { validate } from 'class-validator';
import { PrismaService } from 'src/prisma.service';
import { RabbitService } from 'src/rmq/rmq.service';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '@prisma/client';
import { HttpService } from '@nestjs/axios';
import crypto, { randomUUID } from 'node:crypto';
import { resolve } from 'node:path';
import * as fs from 'node:fs';

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
      data: {
        id: randomUUID(),
        ...data,
      },
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
        throw new BadRequestException('User not found.');
      }
      const user = data.data;

      return user;
    } catch (error) {
      throw new BadRequestException('User not found.');
    }
  }

  async getAvatar(userId: number) {
    const filename = resolve('src', 'avatar', `${userId}.jpg`);

    if (fs.existsSync(filename).valueOf()) {
      console.log('hi 1');

      //convert it into base64 and send to the user

      const bitmap = fs.readFileSync(filename);
      const convertedBase64 = Buffer.from(bitmap).toString('base64');
      return { base64: convertedBase64 };
    }

    console.log('hi 2');
    const findAvatar = await this.prismaService.avatar.findFirst({
      where: { userId: String(userId) },
    });

    if (findAvatar && findAvatar.avatar) {
      const avatarDb = findAvatar.avatar;

      fs.writeFileSync(filename, avatarDb);

      return { base64: avatarDb };
    }

    console.log('hi 3');
    const url = `https://reqres.in/api/users/${userId}`;

    const { data } = await this.httpService.axiosRef.get(url);

    if (!data.data) {
      throw new BadRequestException('User not found.');
    }

    const { avatar } = data.data;

    const responseBase64 = await this.httpService.axiosRef(avatar, {
      responseType: 'arraybuffer',
    });

    fs.writeFileSync(filename, responseBase64.data);
    const bitmap = fs.readFileSync(filename);
    const convertedBase64 = Buffer.from(bitmap).toString('base64');

    await this.prismaService.avatar.create({
      data: {
        id: randomUUID(),
        userId: String(userId),
        avatar: convertedBase64,
      },
    });
    return { base64: convertedBase64 };
  }

  async removeAvatar(userId: number) {
    const filename = resolve('src', 'avatar', `${userId}.jpg`);
    if (fs.existsSync(filename).valueOf()) {
      fs.unlinkSync(filename);
    }

    const findAvatar = await this.prismaService.avatar.findFirst({
      where: { userId: String(userId) },
    });

    if (!findAvatar) {
      throw new BadRequestException('User not found.');
    }

    await this.prismaService.avatar.delete({
      where: { id: findAvatar.id },
    });
  }
}
