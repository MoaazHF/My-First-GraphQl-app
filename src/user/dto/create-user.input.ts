import { InputType, Int, Field } from '@nestjs/graphql';
import { IsEmail, isEmail, IsNumber, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

@InputType()
export class CreateUserInput {
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
