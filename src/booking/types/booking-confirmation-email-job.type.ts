export interface BookingConfirmationEmailJob {
  bookingId: number;
  recipientEmail: string;
  startDate: Date;
  endDate: Date;
  roomDescription: string;
  roomName: string;
  roomPricePerNight: number;
  roomRoomType: string;
  totalPrice: number;
  userFullName: string;
  userAge: number;
  userPhoneNumber?: string;
  action: 'dispatch_email';
}
