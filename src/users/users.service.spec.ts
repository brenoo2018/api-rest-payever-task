import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma.service';
import { RabbitService } from '../rmq/rmq.service';
import { MailerService } from '@nestjs-modules/mailer';
import { HttpService } from '@nestjs/axios';
import { randomUUID } from 'crypto';
import { CreateUserDto } from './dto/create-user.dto';

const userDto: CreateUserDto = {
  id: randomUUID(),
  first_name: 'taynan',
  last_name: 'silva',
  email: 'thaynanbreno@gmail.com',
};

interface Avatar {
  base64: string;
}

const avatar: Avatar = {
  base64: Buffer.from('create-base64-string').toString('base64'),
};

describe('UsersService', () => {
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn().mockResolvedValue(userDto),
              create: jest.fn().mockResolvedValue(userDto),
              delete: jest.fn().mockResolvedValue(undefined),
            },
            avatar: {
              findFirst: jest.fn().mockResolvedValue(avatar),
            },
          },
        },
        {
          provide: RabbitService,
          useValue: {
            sendMessage: jest.fn(),
          },
        },
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
        {
          provide: HttpService,
          useValue: {
            axiosRef: {
              get: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });
});
