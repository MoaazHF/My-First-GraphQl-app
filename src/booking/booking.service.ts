import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Repository } from 'typeorm';
import { CreateBookingInput } from './dto/create-booking.input';
import { Room } from '../rooms/entities/room.entity';
import { User } from '../user/entities/user.entity';
import { Status } from './status.enum';
import { UpdateBookingInput } from './dto/update-booking.input';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectQueue('email_queue') private readonly emailQueue: Queue,
  ) {}

  async create(createBookingInput: CreateBookingInput): Promise<Booking> {
    const { startDate, endDate, roomId, userId, numberOfGuests } =
      createBookingInput;
    const { room, user, totalPrice } = await this.validateAndPrepareBooking({
      startDate,
      endDate,
      roomId,
      userId,
      numberOfGuests,
    });

    const newBooking = this.bookingRepository.create({
      startDate,
      endDate,
      numberOfGuests,
      roomId,
      userId,
      totalPrice,
      room,
      user,
    });

    const savedBooking = await this.bookingRepository.save(newBooking);

    // 2. Queue offloading
    await this.emailQueue.add('send-confirmation', {
      bookingId: savedBooking.id, // Replace with your actual variable
      action: 'dispatch_email',
    });
    return savedBooking;
  }

  async update(
    id: number,
    updateBookingInput: UpdateBookingInput,
  ): Promise<Booking> {
    const existingBooking = await this.findOne(id);

    const startDate = updateBookingInput.startDate ?? existingBooking.startDate;
    const endDate = updateBookingInput.endDate ?? existingBooking.endDate;
    const roomId = updateBookingInput.roomId ?? existingBooking.roomId;
    const userId = updateBookingInput.userId ?? existingBooking.userId;
    const numberOfGuests =
      updateBookingInput.numberOfGuests ?? existingBooking.numberOfGuests;

    const { room, user, totalPrice } = await this.validateAndPrepareBooking({
      startDate,
      endDate,
      roomId,
      userId,
      numberOfGuests,
      excludeBookingId: id,
    });

    const updatedBooking = this.bookingRepository.merge(existingBooking, {
      ...updateBookingInput,
      startDate,
      endDate,
      roomId,
      userId,
      numberOfGuests,
      totalPrice,
      room,
      user,
    });

    await this.bookingRepository.save(updatedBooking);
    return this.findOne(id);
  }

  async findOne(id: number): Promise<Booking> {
    const foundBooking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['room', 'user'],
    });
    if (!foundBooking) {
      throw new NotFoundException(`Booking ${id} not found`);
    }

    return foundBooking;
  }

  async findAll(): Promise<Booking[]> {
    return await this.bookingRepository.find({
      relations: ['room', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAllById(id: number): Promise<Booking[]> {
    return this.bookingRepository.find({ where: { id: id } });
  }

  async remove(id: number): Promise<Booking> {
    const booking = await this.findOne(id);
    await this.bookingRepository.remove(booking);
    return booking;
  }

  private async validateAndPrepareBooking(params: {
    startDate: Date;
    endDate: Date;
    roomId: number;
    userId: number;
    numberOfGuests: number;
    excludeBookingId?: number;
  }): Promise<{ room: Room; user: User; totalPrice: number }> {
    const {
      startDate,
      endDate,
      roomId,
      userId,
      numberOfGuests,
      excludeBookingId,
    } = params;

    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (!room) {
      throw new NotFoundException(`The Room With ${roomId} not found`);
    }
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`The User With ${userId} not found`);
    }
    if (!room.isAvailable) {
      throw new BadRequestException(`Room ${roomId} is currently unavailable`);
    }
    if (numberOfGuests > room.capacity) {
      throw new BadRequestException(
        `Room ${roomId} can host up to ${room.capacity} guests only`,
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const startUtc = Date.UTC(
      start.getUTCFullYear(),
      start.getUTCMonth(),
      start.getUTCDate(),
    );
    const endUtc = Date.UTC(
      end.getUTCFullYear(),
      end.getUTCMonth(),
      end.getUTCDate(),
    );
    const diffTime = endUtc - startUtc;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 1) {
      throw new BadRequestException('Booking duration must be at least 1 day');
    }

    const overlapQuery = this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.roomId = :roomId', { roomId })
      .andWhere('booking.status != :canceled', { canceled: Status.CANCElED })
      .andWhere('booking.startDate < :endDate', { endDate })
      .andWhere('booking.endDate > :startDate', { startDate });

    if (excludeBookingId) {
      overlapQuery.andWhere('booking.id != :excludeBookingId', {
        excludeBookingId,
      });
    }

    const overlapBooking = await overlapQuery.getOne();

    if (overlapBooking) {
      throw new ConflictException(
        `Room ${roomId} is already booked for the selected dates`,
      );
    }

    return { room, user, totalPrice: diffDays * Number(room.pricePerNight) };
  }
}
