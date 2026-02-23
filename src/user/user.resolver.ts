import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Parent,
  ResolveField,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Booking } from '../booking/entities/booking.entity';
import { BookingService } from '../booking/booking.service';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private bookingService: BookingService,
  ) {}

  @Mutation(() => User)
  createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return this.userService.create(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  users(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Query(() => User, { name: 'user' })
  user(@Args('id', { type: () => Int }) id: number): Promise<User> {
    return this.userService.findOneById(id);
  }
  @Query(() => User, { name: 'userByEmail' })
  userByEmail(@Args('email') email: string): Promise<User> {
    return this.userService.findOneByEmail(email);
  }
  @Query(() => User, { name: 'login' })
  signIn(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<User> {
    return this.userService.signIn(email, password);
  }

  @Mutation(() => User)
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<User> {
    return this.userService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.userService.remove(id);
  }

  @ResolveField('fullName', () => String)
  getFullName(@Parent() user: User): string {
    return `${user.firstName} ${user.lastName}`;
  }

  @ResolveField('bookings', () => [Booking])
  async getBookings(@Parent() user: User): Promise<Booking[]> {
    return await this.bookingService.findAllById(user.id);
  }
}
