// src/forms/dtos/create-sync-queue.dto.ts
import { IsUUID, IsString, IsOptional, IsObject, IsNumber, IsInt, IsDateString } from 'class-validator';

export class CreateSyncQueueDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  formDataId: string;

  @IsOptional()
  @IsString()
  deviceId?: string;

  @IsString()
  operation: string; // create | update | delete | sync

  @IsObject()
  payload: Record<string, any>;

  @IsOptional()
  @IsString()
  status?: string; // pending | processing | completed | failed

  @IsOptional()
  @IsInt()
  retryCount?: number;

  @IsOptional()
  @IsString()
  errorMessage?: string;

  @IsOptional()
  @IsDateString()
  processedAt?: string; // ISO date string, opcional
}
