import { Test, TestingModule } from '@nestjs/testing';
import { BookingResolver } from './booking.resolver';
import { BookingService } from './booking.service';

describe('BookingResolver', () => {
  let resolver: BookingResolver;

  const mockBookingService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockPubSub = {
    asyncIterableIterator: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingResolver,
        {
          provide: BookingService,
          useValue: mockBookingService,
        },
        {
          provide: 'PUB_SUB',
          useValue: mockPubSub,
        },
      ],
    }).compile();

    resolver = module.get<BookingResolver>(BookingResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
