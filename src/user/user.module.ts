import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Booking } from '../booking/entities/booking.entity';
import { BookingService } from '../booking/booking.service';
import { Room } from '../rooms/entities/room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Booking, Room])],
  providers: [UserResolver, UserService, BookingService, Booking],
  exports: [UserService],
})
export class UserModule {}
