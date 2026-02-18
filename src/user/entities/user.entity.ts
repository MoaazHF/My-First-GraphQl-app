import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { UserRole } from '../user.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Booking } from '../../booking/entities/booking.entity';

registerEnumType(UserRole, {
  name: 'UserRole',
});
@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => Int, { description: 'Id For the User ' })
  id: number;

  @Field()
  @IsString()
  @Column()
  firstName: string;

  @Field()
  @IsString()
  @Column()
  lastName: string;

  @Field()
  @IsEmail()
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  @Field(() => UserRole)
  role: UserRole;

  @Field()
  @Column()
  age: number;

  @Field(() => [Booking], { nullable: true })
  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @IsPhoneNumber('EG')
  @Column({ nullable: true })
  phoneNumber?: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
