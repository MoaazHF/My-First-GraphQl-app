import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    const user = this.userRepo.create(createUserInput);
    return this.userRepo.save(user);
  }

  async signIn(email: string, pass: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { email },
      select: ['id', 'password', 'email', 'firstName', 'lastName', 'role'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await argon2.verify(user.password, pass);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.find({
      order: {
        id: 'ASC',
      },
    });
  }

  async findOneByEmail(email: string): Promise<User> {
    const found = await this.userRepo.findOne({ where: { email: email } });
    if (!found) {
      throw new NotFoundException(`The user With email:${email} Not found`);
    }
    return found;
  }
  async findOneById(id: number): Promise<User> {
    const found = await this.userRepo.findOne({ where: { id: id } });
    if (!found) {
      throw new NotFoundException(`The User With email: ${id}`);
    }
    return found;
  }

  async update(id: number, updateUserInput: UpdateUserInput): Promise<User> {
    const updatedUser = await this.userRepo.preload({
      id,
      ...updateUserInput,
    });
    if (!updatedUser) {
      throw new NotFoundException(`The User With id:${id}`);
    }
    return await this.userRepo.save(updatedUser);
  }

  async remove(id: number) {
    const user = await this.findOneById(id);
    await this.userRepo.remove(user);
    return 1;
  }
}
