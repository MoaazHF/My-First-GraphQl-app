import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: { login: jest.Mock };

  beforeEach(async () => {
    authService = { login: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should delegate login to auth service', async () => {
    authService.login.mockResolvedValue({ access_token: 'jwt-token' });

    const result = await controller.login({
      user: { id: 1, email: 'user@mail.com' },
    });

    expect(authService.login).toHaveBeenCalledWith({
      id: 1,
      email: 'user@mail.com',
    });
    expect(result).toEqual({ access_token: 'jwt-token' });
  });
});
