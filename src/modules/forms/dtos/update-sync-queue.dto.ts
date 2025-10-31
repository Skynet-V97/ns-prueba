// src/forms/dtos/update-sync-queue.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateSyncQueueDto } from './create-sync-queue.dto';

export class UpdateSyncQueueDto extends PartialType(CreateSyncQueueDto) {}
