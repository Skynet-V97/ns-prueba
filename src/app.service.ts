import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'NS-Prueba API corriendo correctamente (NestJS + Postgres + Docker)';
  }
}
