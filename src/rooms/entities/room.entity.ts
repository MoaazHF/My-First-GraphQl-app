import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Booking } from '../../booking/entities/booking.entity';

@ObjectType()
@Entity()
export class Room {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  description: string;

  @Field(() => [String])
  @Column('text', { array: true })
  images: string[];

  @OneToMany(() => Booking, (booking) => booking.room)
  @Field(() => [Boolean])
  @Column('boolean', { array: true })
  booked: boolean[];
}
