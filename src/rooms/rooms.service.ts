import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';
import { CreateRoomInput } from './dto/create-room.input';

@Injectable()
export class RoomsService {
  constructor(@InjectRepository(Room) private roomRepo: Repository<Room>) {}

  async create(createRoomInput: CreateRoomInput): Promise<Room> {
    const newRoom = this.roomRepo.create(createRoomInput);
    return await this.roomRepo.save(newRoom);
  }

  async findAll(): Promise<Room[]> {
    return await this.roomRepo.find();
  }

  async findOne(id: number): Promise<Room> {
    const foundRoom = await this.roomRepo.findOne({ where: { id } });

    return foundRoom;
  }
}
