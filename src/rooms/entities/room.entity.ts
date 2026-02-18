import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Booking } from '../../booking/entities/booking.entity';
import { RoomType } from '../room-type.enum'; // create this enum

@ObjectType()
@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ length: 100 })
  @Field()
  name: string;

  @Column({ type: 'text' }) // 🔥 text for long content, not varchar
  @Field()
  description: string;

  @Column('text', { array: true, default: [] })
  @Field(() => [String])
  images: string[];

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @Field(() => Float)
  pricePerNight: number; // 🔥 price belongs on Room, not recalculated each booking

  @Column({ type: 'smallint', unsigned: true })
  @Field(() => Int)
  capacity: number; // 🔥 max guests — important for availability filtering

  @Column({
    type: 'enum',
    enum: RoomType,
    default: RoomType.STANDARD,
  })
  @Field(() => RoomType) // e.g. STANDARD | DELUXE | SUITE
  roomType: RoomType;

  @Column({ default: true })
  @Field()
  isAvailable: boolean; // 🔥 admin-controlled flag (maintenance, renovation, etc.)
  //    NOT a substitute for booking availability logic

  @OneToMany(() => Booking, (booking) => booking.room, { lazy: true })
  @Field(() => [Booking], { nullable: true })
  bookings: Promise<Booking[]>; // 🗑️ removed booked: boolean[] — this is derived data

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}
