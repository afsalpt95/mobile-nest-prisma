import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', // your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // allow cookies
  });

  app.setGlobalPrefix('api');

  //  Swagger config
  const config = new DocumentBuilder()
    .setTitle('Mobile Server API')
    .setDescription('API documentation for authentication & users')
    .setVersion('1.0')
    // .addBearerAuth() //  for JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.useGlobalPipes(new ValidationPipe());
  console.log('Listening on port', process.env.PORT ?? 3000);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
