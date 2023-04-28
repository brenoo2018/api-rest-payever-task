import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma.service';
import { randomUUID } from 'crypto';
import { CreateUserDto } from './dto/create-user.dto';

const userEntityList: CreateUserDto = {
  id: randomUUID(),
  first_name: 'taynan',
  last_name: 'silva',
  email: 'thaynanbreno@gmail.com',
};

describe('UsersController', () => {
  let userController: UsersController;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn().mockResolvedValue(userEntityList),
            findUserById: jest.fn().mockResolvedValue(userEntityList),
            getAvatar: jest.fn(),
            removeAvatar: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            onModuleInit: jest.fn(),
            enableShutdownHooks: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get<UsersController>(UsersController);
    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('createUser', () => {
    it('it should be possible to create a user', async () => {
      //act
      const newUser = {
        id: randomUUID(),
        first_name: 'taynan',
        last_name: 'silva',
        email: 'thaynanbreno@gmail.com',
      };

      const result = await userController.createUser(newUser);

      //assert
      expect(result).toEqual(userEntityList);
      expect(typeof result).toEqual('object');
    });

    it('it should be possible to search for a user', async () => {
      //act
      const result = await userController.findUserById(String(2));

      //assert
      expect(result.first_name).toEqual(expect.any(String));
      expect(result.last_name).toEqual(expect.any(String));
      expect(result.email).toEqual(expect.any(String));
      expect(typeof result).toEqual('object');
    });
  });
});
