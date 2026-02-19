import {
  BadRequestException,
  // BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Repository } from 'typeorm';
import { CreateBookingInput } from './dto/create-booking.input';
import { Room } from '../rooms/entities/room.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createBookingInput: CreateBookingInput): Promise<Booking> {
    const { startDate, endDate, roomId, userId, numberOfGuests } =
      createBookingInput;
    const room = await this.roomRepository.findOne({ where: { id: roomId } });

    if (!room) {
      throw new NotFoundException(`The Room With ${roomId} not found`);
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 1) {
      throw new BadRequestException('Booking duration must be at least 1 day');
    }

    const totalPrice = diffDays * room.pricePerNight;
    console.log('HIiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii13131313131313');
    const newBooking = this.bookingRepository.create({
      startDate,
      endDate,
      numberOfGuests,
      roomId,
      userId,
      totalPrice: totalPrice,
      room: room,
      user: { id: userId } as User,
    });

    return await this.bookingRepository.save(newBooking);
  }

  async findOne(id: number): Promise<Booking> {
    const foundBooking = await this.bookingRepository.findOne({
      where: { id },
    });
    if (!foundBooking) {
      throw new NotFoundException(`Booking ${id} not found`);
    }
    console.log(foundBooking);
    return foundBooking;
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingRepository.find();
  }
}
