import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailerService } from '@nestjs-modules/mailer';

@Processor('email_queue')
export class BookingProcessor extends WorkerHost {
  constructor(private readonly mailerService: MailerService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const {
      bookingId,
      startDate,
      endDate,
      room,
      roomRoomType,
      roomPricePerNight,
      roomDescription,
      roomName,
      userFullName,
      userAge,
      userPhoneNumber,
    } = job.data;
    console.log(job.data);
    const targetEmail = 'moazhasanfarouk@gmail.com';

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; background-color: #ffffff; color: #333333;">
        
        <div style="background-color: #1a1a1a; padding: 25px; text-align: center; border-bottom: 3px solid #d4af37;">
          <h1 style="color: #d4af37; margin: 0; font-size: 26px; text-transform: uppercase; letter-spacing: 2px;">The Grind Hotel</h1>
          <p style="color: #ffffff; margin: 5px 0 0 0; font-size: 14px;">Official Booking Confirmation</p>
        </div>
        
        <div style="padding: 30px;">
          <h2 style="color: #1a1a1a; font-size: 20px; margin-top: 0;">Dear ${userFullName},</h2>
          <p style="font-size: 15px; line-height: 1.6; color: #555555;">Your reservation has been successfully processed. Please review your booking and personal details below.</p>
          
          <h3 style="color: #d4af37; border-bottom: 1px solid #eeeeee; padding-bottom: 8px; margin-top: 30px; font-size: 18px;">Reservation Details</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 14px;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; font-weight: bold; width: 40%; color: #333;">Booking Reference</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; color: #555;">#${bookingId}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #333;">Check-in Date</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; color: #555;">${new Date(startDate).toLocaleDateString()}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #333;">Check-out Date</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; color: #555;">${new Date(endDate).toLocaleDateString()}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #333;">Room</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; color: #555;">${roomName} (${roomRoomType})</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #333;">Description</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; color: #555;">${roomDescription}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #333;">Price Per Night</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; color: #555;">$${roomPricePerNight}</td>
            </tr>
          </table>

          <h3 style="color: #d4af37; border-bottom: 1px solid #eeeeee; padding-bottom: 8px; margin-top: 30px; font-size: 18px;">Guest Information</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 14px;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; font-weight: bold; width: 40%; color: #333;">Full Name</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; color: #555;">${userFullName}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #333;">Age</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; color: #555;">${userAge}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #333;">Phone Number</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; color: #555;">${userPhoneNumber}</td>
            </tr>
          </table>

          <div style="background-color: #fff8e1; border-left: 4px solid #ffc107; padding: 15px; margin-top: 30px; border-radius: 4px;">
            <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.5;">
              <strong>هام جداً:</strong> إذا كان هناك أي خطأ في البيانات المذكورة أعلاه، يرجى التواصل معنا فوراً لتحديث الحجز على الرقم: <br>
              <a href="tel:01200063681" style="color: #b8860b; font-weight: bold; font-size: 16px; text-decoration: none; display: inline-block; margin-top: 5px;">01200063681</a>
            </p>
          </div>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #888888; font-size: 12px; border-top: 1px solid #eeeeee;">
          &copy; ${new Date().getFullYear()} The Grind Hotel. All rights reserved.
        </div>
      </div>
    `;

    await this.mailerService.sendMail({
      to: targetEmail,
      from: '"The Grind Hotel" <noreply@thegrindhotel.com>',
      subject: `Booking Confirmation #${bookingId}`,
      html: htmlContent, // استبدال خاصية text بخاصية html
    });
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    console.error(`SMTP Dispatch Failed for Job ${job.id}: ${error.message}`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log(`Email successfully dispatched for Job ${job.id}`);
  }
}
