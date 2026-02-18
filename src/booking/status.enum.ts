import { registerEnumType } from '@nestjs/graphql';

export enum Status {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCElED = 'CANCELED',
  COMPLETED = 'COMPLETED',
}
registerEnumType(Status, { name: 'Status' });
