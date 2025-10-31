// src/modules/forms/forms.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import {
  User,
  Form,
  FormVersion,
  FormSection,
  FormField,
  FieldOption,
  ValidationRule,
  FieldDependency,
  CollectionTemplate,
  BusinessRule,
  FormData,
  CollectionData,
  FormAttachment,
  SyncQueue,
} from './entities';

// Services
import { FormService } from './services/form.service';
import { FormDataService } from './services/form-data.service';
import { SyncQueueService } from './services/sync-queue.service';
import { BusinessRuleService } from './services/business-rule.service';

// Controllers
import { FormController } from './controllers/form.controller';
import { FormDataController } from './controllers/form-data.controller';
import { SyncQueueController } from './controllers/sync-queue.controller';

// Repositories
import { FormRepository } from './repositories/form.repository';
import { FormDataRepository } from './repositories/form-data.repository';
import { SyncQueueRepository } from './repositories/sync-queue.repository';
import { BusinessRuleRepository } from './repositories/business-rule.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Form,
      FormVersion,
      FormSection,
      FormField,
      FieldOption,
      ValidationRule,
      FieldDependency,
      CollectionTemplate,
      BusinessRule,
      FormData,
      CollectionData,
      FormAttachment,
      SyncQueue,
    ]),
  ],
  controllers: [
    FormController,
    FormDataController,
    SyncQueueController,
  ],
  providers: [
    // Services
    FormService,
    FormDataService,
    SyncQueueService,
    BusinessRuleService,

    // Repositories personalizados
    FormRepository,
    FormDataRepository,
    SyncQueueRepository,
    BusinessRuleRepository, // <--- Ahora registrado
  ],
  exports: [
    TypeOrmModule,
    FormService,
    FormDataService,
    SyncQueueService,
    BusinessRuleService, // exportar si otros módulos lo usan
  ],
})
export class FormsModule {}
