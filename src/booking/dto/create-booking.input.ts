import { Field, InputType, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, Min } from 'class-validator';

@InputType()
export class CreateBookingInput {
  @Field()
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @Field()
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  endDate: Date;

  @Field(() => Int)
  @Min(1)
  @IsNotEmpty()
  numberOfGuests: number;

  @Field(() => Int)
  @IsNotEmpty()
  userId: number;

  @Field(() => Int)
  @IsNotEmpty()
  roomId: number;
}
