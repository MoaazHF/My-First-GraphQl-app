import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let userService: { signIn: jest.Mock };
  let jwtService: { signAsync: jest.Mock };

  beforeEach(async () => {
    userService = { signIn: jest.fn() };
    jwtService = { signAsync: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: userService,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should sign token in login', async () => {
    jwtService.signAsync.mockResolvedValue('jwt-token');

    const result = await service.login({ id: 7, email: 'user@mail.com' });

    expect(jwtService.signAsync).toHaveBeenCalledWith({
      sub: 7,
      email: 'user@mail.com',
    });
    expect(result).toEqual({ access_token: 'jwt-token' });
  });

  it('should validate user then return token in signIn', async () => {
    userService.signIn.mockResolvedValue({ id: 10, email: 'u@t.com' });
    jwtService.signAsync.mockResolvedValue('jwt-token');

    const result = await service.signIn('u@t.com', '123456');

    expect(userService.signIn).toHaveBeenCalledWith('u@t.com', '123456');
    expect(jwtService.signAsync).toHaveBeenCalledWith({
      sub: 10,
      email: 'u@t.com',
    });
    expect(result).toEqual({ access_token: 'jwt-token' });
  });
});
