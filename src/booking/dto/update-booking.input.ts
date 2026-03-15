import { Status } from '../status.enum';
import { CreateBookingInput } from './create-booking.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateBookingInput extends PartialType(CreateBookingInput) {
  @Field(() => Int)
  id: number;

  @Field(() => Status, { nullable: true })
  status?: Status;
}
