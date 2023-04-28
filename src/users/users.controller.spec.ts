import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma.service';
import { randomUUID } from 'crypto';
import { CreateUserDto } from './dto/create-user.dto';

interface UserAvatar {
  base64: string;
}

const userDto: CreateUserDto = {
  id: randomUUID(),
  first_name: 'taynan',
  last_name: 'silva',
  email: 'thaynanbreno@gmail.com',
};

const userAvatar: UserAvatar = {
  base64: Buffer.from('create-base64-string').toString('base64'),
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
            createUser: jest.fn().mockResolvedValue(userDto),
            findUserById: jest.fn().mockResolvedValue(userDto),
            getAvatar: jest.fn().mockResolvedValue(userAvatar),
            removeAvatar: jest.fn().mockResolvedValue(undefined),
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
      expect(result).toEqual(userDto);
      expect(typeof result).toEqual('object');
    });
    it('it should be possible to return an exception error when creating the user', async () => {
      //arrange
      jest.spyOn(userService, 'createUser').mockRejectedValueOnce(new Error());
      //act
      const newUser = {
        id: randomUUID(),
        first_name: 'taynan',
        last_name: 'silva',
        email: 'thaynanbreno@gmail.com',
      };

      //assert
      expect(userController.createUser(newUser)).rejects.toThrowError();
    });
  });

  describe('findUserById', () => {
    it('it should be possible to search for a user', async () => {
      //act
      const result = await userController.findUserById(String(2));

      //assert
      expect(result.first_name).toEqual(expect.any(String));
      expect(result.last_name).toEqual(expect.any(String));
      expect(result.email).toEqual(expect.any(String));
      expect(typeof result).toEqual('object');
    });

    it('it should be possible to return an exception error when searching the user', async () => {
      //arrange
      jest
        .spyOn(userService, 'findUserById')
        .mockRejectedValueOnce(new Error());

      //assert
      expect(userController.findUserById(String(2))).rejects.toThrowError();
    });
  });

  describe('getAvatar', () => {
    it(`it should be possible to fetch a user's avatar`, async () => {
      //act
      const result = await userController.getAvatar(String(2));

      //assert
      expect(result.base64).toEqual(expect.any(String));
      expect(typeof result).toEqual('object');
    });

    it(`it should be possible to return an exception error when searching the user avatar`, async () => {
      //arrange
      jest.spyOn(userService, 'getAvatar').mockRejectedValueOnce(new Error());

      //assert
      expect(userController.getAvatar(String(2))).rejects.toThrowError();
    });
  });

  describe('removeAvatar', () => {
    it(`it should be possible to remove a user's avatar`, async () => {
      //act
      const result = await userController.removeAvatar(String(2));

      //assert
      expect(result).toBeUndefined();
    });
    it(`it should be possible to return exception error when removing user avatar`, async () => {
      //arrange
      jest
        .spyOn(userService, 'removeAvatar')
        .mockRejectedValueOnce(new Error());

      //assert
      expect(userController.removeAvatar(String(2))).rejects.toThrowError();
    });
  });
});
