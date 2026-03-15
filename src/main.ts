import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { webcrypto } from 'node:crypto';

if (!(globalThis as { crypto?: unknown }).crypto) {
  (globalThis as { crypto?: unknown }).crypto = webcrypto;
}

async function bootstrap() {
  const { AppModule } = await import('./app.module');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  app.enableCors({
    origin: true,
    credentials: true,
  });
  const port = configService.get<string>('PORT');

  await app.listen(port);
  console.log(`The app has connected on Port :${port}`);
}
bootstrap();
