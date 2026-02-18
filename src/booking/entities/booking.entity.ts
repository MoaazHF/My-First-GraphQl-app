import { ObjectType, Field, Float, Int } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Status } from '../status.enum';
import { User } from '../../user/entities/user.entity';
import { Room } from '../../rooms/entities/room.entity';

@ObjectType()
@Entity('bookings')
@Index(['roomId', 'startDate', 'endDate']) // 🔥 the most critical index in the whole app
export class Booking {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ type: 'date' }) // 🔥 'date' not 'timestamp' — you book nights, not hours
  @Field()
  startDate: Date;

  @Column({ type: 'date' })
  @Field()
  endDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @Field(() => Float)
  totalPrice: number; // snapshot of price at time of booking (Room price may change)

  @Column({ type: 'smallint', unsigned: true })
  @Field(() => Int)
  numberOfGuests: number; // 🔥 needed for capacity validation

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PENDING,
  })
  @Field(() => Status)
  status: Status;

  // ─── User Relation ───────────────────────────────────────────────────────────

  @Index() // 🔥 "get all bookings for user X" is a very common query
  @Column()
  @Field(() => Int)
  userId: number;

  @ManyToOne(() => User, (user) => user.bookings, {
    onDelete: 'CASCADE',
    lazy: true,
  })
  @JoinColumn({ name: 'userId' }) // 🔥 explicit JoinColumn keeps the FK name predictable
  @Field(() => User)
  user: Promise<User>;

  // ─── Room Relation ────────────────────────────────────────────────────────────

  @Column()
  @Field(() => Int)
  roomId: number;

  @ManyToOne(() => Room, (room) => room.bookings, {
    onDelete: 'RESTRICT', // 🔥 RESTRICT not CASCADE — don't delete bookings if room deleted
    lazy: true,
  })
  @JoinColumn({ name: 'roomId' })
  @Field(() => Room)
  room: Promise<Room>;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}
