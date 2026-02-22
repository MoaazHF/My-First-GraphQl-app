import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RoomsService } from './rooms.service';
import { Room } from './entities/room.entity';
import { CreateRoomInput } from './dto/create-room.input';
import { UpdateRoomInput } from './dto/update-room.input';

@Resolver(() => Room)
export class RoomsResolver {
  constructor(private readonly roomsService: RoomsService) {}

  @Mutation(() => Room)
  createRoom(
    @Args('createRoomInput') createRoomInput: CreateRoomInput,
  ): Promise<Room> {
    return this.roomsService.create(createRoomInput);
  }

  @Query(() => [Room], { name: 'rooms' })
  rooms(): Promise<Room[]> {
    return this.roomsService.findAll();
  }

  @Query(() => Room, { name: 'room' })
  room(@Args('id', { type: () => Int }) id: number): Promise<Room> {
    return this.roomsService.findOne(id);
  }

  @Mutation(() => Room)
  updateRoom(
    @Args('updateRoomInput') updateRoomInput: UpdateRoomInput,
  ): Promise<Room> {
    return this.roomsService.update(updateRoomInput.id, updateRoomInput);
  }

  @Mutation(() => Room)
  removeRoom(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    return this.roomsService.remove(id);
  }
}
