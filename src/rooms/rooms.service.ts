import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';
import { CreateRoomInput } from './dto/create-room.input';
import { UpdateRoomInput } from './dto/update-room.input';
import { Booking } from '../booking/entities/booking.entity';
import { Status } from '../booking/status.enum';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room) private roomRepo: Repository<Room>,
    @InjectRepository(Booking) private bookRepo: Repository<Booking>,
  ) {}

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
    const room = await this.roomRepo.preload({
      id,
      ...updateRoomInput,
    });
    if (!room) {
      throw new NotFoundException(`The Room with Id:${id} Not Found.`);
    }

    return this.roomRepo.save(room);
  }

  async remove(id: number): Promise<boolean> {
    const roomFound = await this.roomRepo.findOne({ where: { id } });
    if (!roomFound) {
      throw new NotFoundException(`The Room With Id:${id}`);
    }
    const activateBookingsCount = await this.bookRepo.count({
      where: {
        room: { id },
        status: Status.CONFIRMED,
      },
    });

    if (activateBookingsCount > 0) {
      throw new ConflictException(
        `The Room with ID:${id} You Trying To delete Is Booked.`,
      );
    }
    await this.roomRepo.delete(id);
    return true;
  }
}
