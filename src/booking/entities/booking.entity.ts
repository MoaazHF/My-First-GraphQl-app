import {
  ObjectType,
  Field,
  Float,
  Int,
  registerEnumType,
} from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Status } from '../status.enum';
import { User } from '../../user/entities/user.entity';
import { Room } from '../../rooms/entities/room.entity';

registerEnumType(Status, {
  name: 'Status',
});

@ObjectType()
@Entity()
export class Booking {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  startDate: Date;

  @Field()
  @Column()
  endDate: Date;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PENDING,
  })
  @Field(() => Status)
  status: Status;

  //The Object Which is returned

  @ManyToOne(() => User, (user) => user.bookings, { onDelete: 'CASCADE' })
  @Field(() => User)
  user: User;

  //The ID
  @Column()
  @Field(() => Int)
  userId: number;

  //The Object which is returned
  @ManyToOne(() => Room, (room) => room.booked)
  @Field(() => Room)
  room: Room;

  @Field(() => Int)
  @Column()
  roomId: number;
}
