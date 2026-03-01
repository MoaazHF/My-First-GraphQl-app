import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { PubSub } from 'graphql-subscriptions';

import { BookingService } from './booking.service';
import { BookingResolver } from './booking.resolver';
import { BookingProcessor } from './booking.consumer';
import { Booking } from './entities/booking.entity';
import { Room } from '../rooms/entities/room.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email_queue',
    }),
    TypeOrmModule.forFeature([Booking, Room, User]),
  ],
  providers: [
    BookingResolver,
    BookingService,
    BookingProcessor,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
  exports: [BookingService],
})
export class BookingModule {}
