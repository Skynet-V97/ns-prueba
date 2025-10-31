import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

// Verificar que las variables de entorno estén siendo cargadas
console.log('Database password:', process.env.DB_PASS);  // Esto debería mostrar la contraseña de la base de datos

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
