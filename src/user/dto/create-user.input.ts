import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  Min,
} from 'class-validator';
import { UserRole } from '../user.enum';

@InputType()
export class CreateUserInput {
  @Field()
  @IsString()
  @IsNotEmpty({ message: 'The First Name is required.' })
  firstName: string;

  @Field()
  @IsString()
  @IsNotEmpty({ message: 'The Last Name is required.' })
  lastName: string;

  @Field()
  @IsEmail()
  @IsNotEmpty({ message: 'The Email is Required.' })
  email: string;

  @Field()
  @IsStrongPassword()
  @IsNotEmpty({ message: 'The Password is Required.' })
  password: string;

  @Field(() => UserRole, { nullable: true })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @Field(() => Int, { nullable: false })
  @IsInt()
  @Min(18)
  age: number;

  @Field({ nullable: false })
  @IsPhoneNumber('EG')
  phoneNumber: string;
}
