import { ObjectType, Field, Int } from '@nestjs/graphql';
import { UserRole } from '../user.enum';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Booking } from '../../booking/entities/booking.entity';
import * as argon2 from 'argon2';
import { Exclude } from 'class-transformer';
import { IsStrongPassword } from 'class-validator';

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

  @Field({ nullable: true })
  fullName?: string;

  @Index()
  @Column({ unique: true })
  @Field()
  email: string;

  @Column({ select: false })
  @IsStrongPassword()
  password: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashingPassword() {
    if (this.password && !this.password.startsWith('$argon2')) {
      this.password = (await argon2.hash(this.password)) as string;
    }
  }

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

  @Column({ type: 'smallint', unsigned: true, nullable: false }) // 🔥 smallint saves space vs int
  @Field(() => Int, { nullable: false })
  age: number;

  @Column({ nullable: true, length: 15 })
  @Field({ nullable: true })
  phoneNumber?: string;

  @Column({ default: true }) // 🔒 for soft disabling accounts without deletion
  @Field()
  isActive: boolean;

  @OneToMany(() => Booking, (booking) => booking.user) // 🔥 lazy avoids N+1
  @Field(() => [Booking], { nullable: true })
  bookings: Booking[]; // Promise<> is required for lazy relations in TypeORM

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn() // 🔥 always know when the record last changed
  @Field()
  updatedAt: Date;
}
