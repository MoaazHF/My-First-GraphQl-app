import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailerService } from '@nestjs-modules/mailer';

@Processor('email_queue')
export class BookingProcessor extends WorkerHost {
  constructor(private readonly mailerService: MailerService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { bookingId } = job.data;

    // ستحتاج لاحقاً لجلب البريد الفعلي للمستخدم من قاعدة البيانات باستخدام userId
    await this.mailerService.sendMail({
      to: 'moazhasanfarouk@gmail.com',
      from: 'noreply@thegrindhotel.com',
      subject: 'Booking Confirmation',
      text: `Your booking ID: ${bookingId} has been confirmed.`,
    });
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    console.error(`SMTP Dispatch Failed for Job ${job.id}: ${error.message}`);
  }
}
