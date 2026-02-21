import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';
import { CreateRoomInput } from './dto/create-room.input';
import { UpdateRoomInput } from './dto/update-room.input';

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
    if (!foundRoom) {
      throw new NotFoundException(`Room ${id} not found`);
    }

    return foundRoom;
  }

  async update(id: number, updateRoomInput: UpdateRoomInput): Promise<Room> {
    await this.findOne(id);

    const updatedRoom = this.roomRepo.merge({ id } as Room, updateRoomInput);
    await this.roomRepo.save(updatedRoom);

    return this.findOne(id);
  }

  async remove(id: number): Promise<Room> {
    const room = await this.findOne(id);
    await this.roomRepo.remove(room);
    return room;
  }
}
