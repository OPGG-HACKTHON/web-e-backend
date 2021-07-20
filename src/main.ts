import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // validation을 위한 decorator가 붙어있지 않은 속성들은 제거, validator에 도달하지않음.
      forbidNonWhitelisted: true, //  걸러질 속성이 있다면 request자체를 막아버림.
      transform: true, //요청에서 넘어온 자료들의 형변환
    }),
  );
  await app.listen(3000);
}
bootstrap();
