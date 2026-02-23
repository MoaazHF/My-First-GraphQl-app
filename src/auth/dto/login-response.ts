import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

@ObjectType()
export class Author {
  @Field(() => Int)
  @IsNumber()
  id: number;

  @Field({ nullable: false })
  firstName?: string;

  @Field({ nullable: false })
  lastName?: string;
}
