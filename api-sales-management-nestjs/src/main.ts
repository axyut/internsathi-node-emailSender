import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function start() {
  const app = await NestFactory.create(AppModule);

  // allow connection to frontend
  app.enableCors();

  // parse cookie
  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // swagger -> api documentation
  const options = new DocumentBuilder()
    .setTitle('Sales Management API')
    .setDescription('Sales management app API by Swagger')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter Jwt Token.',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('', app, document);

  // Server
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT, () =>
    console.log(`Server started at http://localhost:${PORT}`),
  );
}
start();
