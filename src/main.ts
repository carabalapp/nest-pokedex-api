import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v2')
  app.useGlobalPipes(
    new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    }
    })
);
  
  // Cabe destacar que en este punto no nos sirve nuestro archivo de configuracion de environments
  // Ya que esta fuera de los building blocks, no podemos hacer la inyeccion de dependencias aqui
  // Por los tanto aqui si debemos ser muy especificos con el puerto ya que no tomara el uno || otro
  await app.listen(process.env.PORT);
  console.log(`App running on port ${process.env.PORT}`)
}
bootstrap();
