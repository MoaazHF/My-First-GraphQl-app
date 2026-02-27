import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingResolver } from './booking.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Room } from '../rooms/entities/room.entity';
import { User } from '../user/entities/user.entity';
import { BullModule } from '@nestjs/bullmq';
import { BookingProcessor } from './booking.consumer';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email_queue',
    }),
    TypeOrmModule.forFeature([Booking, Room, User]),
  ],
  providers: [BookingResolver, BookingService, Booking, BookingProcessor],
  exports: [Booking, BookingService],
})
export class BookingModule {}
