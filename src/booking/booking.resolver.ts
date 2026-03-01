import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Subscription,
} from '@nestjs/graphql';
import { BookingService } from './booking.service';
import { Booking } from './entities/booking.entity';
import { CreateBookingInput } from './dto/create-booking.input';
import { UpdateBookingInput } from './dto/update-booking.input';
import { PubSub } from 'graphql-subscriptions';
import { Inject } from '@nestjs/common';

@Resolver(() => Booking)
export class BookingResolver {
  constructor(
    private readonly bookingService: BookingService,
    @Inject('PUB_SUB') private pubSub: PubSub,
  ) {}

  @Subscription(() => Booking, {
    name: 'bookingStatusUpdated',
  })
  subscribeToBookingStatus() {
    return this.pubSub.asyncIterableIterator('bookingStatusUpdated');
  }
  @Mutation(() => Booking)
  createBooking(
    @Args('createBookingInput') createBookingInput: CreateBookingInput,
  ): Promise<Booking> {
    return this.bookingService.create(createBookingInput);
  }

  @Query(() => [Booking], { name: 'bookings' })
  bookings(): Promise<Booking[]> {
    return this.bookingService.findAll();
  }

  @Query(() => Booking, { name: 'booking' })
  booking(@Args('id', { type: () => Int }) id: number): Promise<Booking> {
    return this.bookingService.findOne(id);
  }

  @Mutation(() => Booking)
  updateBooking(
    @Args('updateBookingInput') updateBookingInput: UpdateBookingInput,
  ): Promise<Booking> {
    return this.bookingService.update(
      updateBookingInput.id,
      updateBookingInput,
    );
  }

  @Mutation(() => Booking)
  removeBooking(@Args('id', { type: () => Int }) id: number): Promise<Booking> {
    return this.bookingService.remove(id);
  }
}
