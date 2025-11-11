import { Injectable } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  HealthIndicatorResult,
  DiskHealthIndicator,
  MemoryHealthIndicator,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
  HealthCheckResult,
} from '@nestjs/terminus';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Form } from '../forms/entities/form.entity';
import { FormVersion } from '../forms/entities/form-version.entity';
import { FormSection } from '../forms/entities/form-section.entity';

@Injectable()
export class HealthService {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private disk: DiskHealthIndicator,
    private memory: MemoryHealthIndicator,
    private http: HttpHealthIndicator,
    @InjectRepository(Form)
    private formRepo: Repository<Form>,
    @InjectRepository(FormVersion)
    private versionRepo: Repository<FormVersion>,
    @InjectRepository(FormSection)
    private sectionRepo: Repository<FormSection>,
  ) {}

  @HealthCheck()
  // Cambiamos la firma de retorno a HealthCheckResult
  async check(): Promise<HealthCheckResult> {
    return this.health.check([
      // Base de datos
      async () => this.db.pingCheck('database', { timeout: 300 }),

      // Disco
      async () =>
        this.disk.checkStorage('disk', {
          path: 'D:\\',
          thresholdPercent: 0.9, // 90%
        }),

      // Memoria Heap
      async () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024), // 150MB

      // Memoria RSS
      async () => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024), // 300MB

      // HTTP externo (ejemplo)
      async () => this.http.pingCheck('google', 'https://www.google.com'),

      // Check personalizado de formularios
      async (): Promise<HealthIndicatorResult> => {
        const totalForms = await this.formRepo.count();
        const totalVersions = await this.versionRepo.count();
        const totalSections = await this.sectionRepo.count();

        return {
          formData: {
            status: 'up',
            totalForms,
            totalVersions,
            totalSections,
          },
        };
      },
    ]);
  }
}
