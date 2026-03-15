import { registerEnumType } from '@nestjs/graphql';

export enum RoomType {
  STANDARD = 'STANDARD',
  DELUXE = 'DELUXE',
  SUITE = 'SUITE',
  PENTHOUSE = 'PENTHOUSE',
}

registerEnumType(RoomType, { name: 'RoomType' });
