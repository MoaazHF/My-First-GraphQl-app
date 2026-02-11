import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

@ObjectType()
export class User {
  @Field(() => Int, { description: 'Id For the User ' })
  id: number;

  @Field()
  @IsString()
  firstName: string; 

  @Field()
  @IsEmail()
  email: string;
  
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @IsPhoneNumber('EG', {message:"The phone number is not valid for Eg."})
  phoneNumber?: string;
}
