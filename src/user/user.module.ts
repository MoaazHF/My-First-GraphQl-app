import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Booking } from '../booking/entities/booking.entity';
import { Room } from '../rooms/entities/room.entity';
import { BookingModule } from '../booking/booking.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Booking, Room]), BookingModule],
  providers: [UserResolver, UserService, Booking],
  exports: [UserService],
})
export class UserModule {}
