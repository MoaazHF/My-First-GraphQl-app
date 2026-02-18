import { InputType, Field, Float, Int } from '@nestjs/graphql';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { RoomType } from '../room-type.enum';

@InputType()
export class CreateRoomInput {
  @Field()
  @IsNotEmpty({ message: 'The name is required' })
  @IsString()
  name: string;

  @Field()
  @IsNotEmpty({ message: 'The description is required' })
  @IsString()
  description: string;

  @IsNotEmpty({ message: 'The images are required' })
  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsNotEmpty({ message: 'The pricePerNight is required' })
  @Field(() => Float)
  @Min(0)
  @IsNumber()
  pricePerNight: number;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  capacity: number;

  @Field(() => RoomType, { nullable: true })
  @IsEnum(RoomType)
  @IsOptional()
  roomType?: RoomType;
}
