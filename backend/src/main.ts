import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://chuzly.app',
      'http://192.168.1.173:5001', // (optionnel si tu veux tester dans le navigateur)
      'null', // React Native fetch
    ],
    credentials: true,
  });

  app.use('/stripe/webhook', bodyParser.raw({ type: 'application/json' }));
  app.use(bodyParser.json());

  await app.listen(process.env.PORT ?? 5001, '0.0.0.0');
}
void bootstrap();
