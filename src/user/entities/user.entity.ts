import { ObjectType, Field, Int } from '@nestjs/graphql';
import { UserRole } from '../user.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Booking } from '../../booking/entities/booking.entity';

@Entity('users')
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ length: 50 })
  @Field()
  firstName: string;

  @Column({ length: 50 })
  @Field()
  lastName: string;

  @Index() // 🔥 speeds up auth lookups dramatically
  @Column({ unique: true })
  @Field()
  email: string;

  @Column({ select: false }) // 🔒 never returned in any query by default
  password: string;

  @Column({ nullable: true, select: false }) // 🔒 for JWT refresh token rotation
  refreshToken?: string;

  @Column({ nullable: true, select: false }) // 🔒 for invalidating tokens after password change
  passwordChangedAt?: Date;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  @Field(() => UserRole)
  role: UserRole;

  @Column({ type: 'smallint', unsigned: true, nullable: true }) // 🔥 smallint saves space vs int
  @Field(() => Int, { nullable: true })
  age?: number;

  @Column({ nullable: true, length: 15 })
  @Field({ nullable: true })
  phoneNumber?: string;

  @Column({ default: true }) // 🔒 for soft disabling accounts without deletion
  @Field()
  isActive: boolean;

  @OneToMany(() => Booking, (booking) => booking.user, { lazy: true }) // 🔥 lazy avoids N+1
  @Field(() => [Booking], { nullable: true })
  bookings: Promise<Booking[]>; // Promise<> is required for lazy relations in TypeORM

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn() // 🔥 always know when the record last changed
  @Field()
  updatedAt: Date;
}
