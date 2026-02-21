import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    return this.userRepo.save(createUserInput);
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  async findOne(id: number): Promise<User> {
    const found = await this.userRepo.findOne({ where: { id } });
    if (!found) {
      throw new NotFoundException(`The User With Id: ${id}`);
    }
    return found;
  }

  async update(id: number, updateUserInput: UpdateUserInput): Promise<User> {
    await this.findOne(id);

    const updatedUser = this.userRepo.merge(
      { id } as User,
      updateUserInput,
    );
    await this.userRepo.save(updatedUser);

    return this.findOne(id);
  }

  async remove(id: number): Promise<User> {
    const user = await this.findOne(id);
    await this.userRepo.remove(user);
    return user;
  }
}
