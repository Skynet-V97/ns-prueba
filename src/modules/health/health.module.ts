import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios'; // <-- Importamos HttpModule
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

// Importamos entidades críticas
import { Form, FormSection, FormVersion } from '../forms/entities';

@Module({
  imports: [
    TerminusModule,
    TypeOrmModule.forFeature([Form, FormVersion, FormSection]),
    HttpModule, // <-- Necesario para HttpHealthIndicator
  ],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
