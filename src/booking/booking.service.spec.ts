import { Test, TestingModule } from '@nestjs/testing';
import { BookingService } from './booking.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Room } from '../rooms/entities/room.entity';
import { User } from '../user/entities/user.entity';
import { getQueueToken } from '@nestjs/bullmq';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

describe('BookingService', () => {
  let service: BookingService;

  const mockBookingRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
    merge: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(null),
    })),
  };

  const mockRoomRepository = {
    findOne: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  const mockQueue = {
    add: jest.fn(),
  };

  const mockPubSub = {
    publish: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        {
          provide: getRepositoryToken(Booking),
          useValue: mockBookingRepository,
        },
        {
          provide: getRepositoryToken(Room),
          useValue: mockRoomRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getQueueToken('email_queue'),
          useValue: mockQueue,
        },
        {
          provide: 'PUB_SUB',
          useValue: mockPubSub,
        },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create booking', () => {
    const createBookingDto = {
      startDate: new Date('2026-03-20'),
      endDate: new Date('2026-03-22'),
      roomId: 1,
      userId: 1,
      numberOfGuests: 2,
    };

    const mockRoom = {
      id: 1,
      name: 'Deluxe Room',
      description: 'A beautiful room',
      pricePerNight: 100,
      capacity: 3,
      isAvailable: true,
      roomType: 'DELUXE',
    };

    const mockUser = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phoneNumber: '1234567890',
      age: 30,
    };

    it('should successfully create a booking', async () => {
      mockRoomRepository.findOne.mockResolvedValue(mockRoom);
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const expectedBooking = {
        id: 1,
        ...createBookingDto,
        totalPrice: 200, // 2 nights * 100
        room: mockRoom,
        user: mockUser,
      };

      mockBookingRepository.create.mockReturnValue(expectedBooking);
      mockBookingRepository.save.mockResolvedValue(expectedBooking);

      const result = await service.create(createBookingDto);

      expect(mockRoomRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockBookingRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          startDate: createBookingDto.startDate,
          endDate: createBookingDto.endDate,
          roomId: createBookingDto.roomId,
          userId: createBookingDto.userId,
          numberOfGuests: createBookingDto.numberOfGuests,
          totalPrice: 200,
        }),
      );
      expect(mockBookingRepository.save).toHaveBeenCalled();
      expect(mockQueue.add).toHaveBeenCalledWith(
        'send-confirmation',
        expect.any(Object),
        expect.any(Object),
      );
      expect(result).toEqual(expectedBooking);
    });

    it('should throw NotFoundException if room is not found', async () => {
      mockRoomRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createBookingDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockRoomRepository.findOne.mockResolvedValue(mockRoom);
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createBookingDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if room is not available', async () => {
      mockRoomRepository.findOne.mockResolvedValue({
        ...mockRoom,
        isAvailable: false,
      });
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.create(createBookingDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if guests exceed capacity', async () => {
      mockRoomRepository.findOne.mockResolvedValue(mockRoom);
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await expect(
        service.create({ ...createBookingDto, numberOfGuests: 5 }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if duration is less than 1 day', async () => {
      mockRoomRepository.findOne.mockResolvedValue(mockRoom);
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await expect(
        service.create({
          ...createBookingDto,
          startDate: new Date('2026-03-20'),
          endDate: new Date('2026-03-20'), // 0 days
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException if room is already booked', async () => {
      mockRoomRepository.findOne.mockResolvedValue(mockRoom);
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      mockBookingRepository.createQueryBuilder.mockReturnValueOnce({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue({ id: 2 }), // Found an overlapping booking
      });

      await expect(service.create(createBookingDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
