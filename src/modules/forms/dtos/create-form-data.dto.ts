// src/forms/dtos/create-form-data.dto.ts
import {
  IsUUID,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsObject,
  IsIn,
  IsDateString,
  IsBoolean,
  IsNumber,
} from 'class-validator';

export class CreateFormDataDto {
  @IsUUID()
  formId: string;

  @IsUUID()
  formVersionId: string;

  @IsUUID()
  userId: string;

  @IsOptional()
  @IsString()
  deviceId?: string;

  @IsObject()
  @IsNotEmpty()
  data: Record<string, any>; // JSON con la estructura dinámica del formulario

  /**
   * Estado típico: 'draft' | 'submitted' | 'synced' | 'failed'
   * Puedes ajustar la lista si deseas un enum estricto en otro lugar.
   */
  @IsOptional()
  @IsIn(['draft', 'submitted', 'synced', 'failed'])
  status?: string;

  @IsOptional()
  @IsBoolean()
  isSynced?: boolean;

  @IsOptional()
  @IsDateString()
  syncedAt?: string;

  @IsOptional()
  @IsNumber()
  syncAttempts?: number;

  @IsOptional()
  @IsString()
  lastSyncError?: string;

  @IsOptional()
  @IsDateString()
  createdAt?: string;

  @IsOptional()
  @IsDateString()
  updatedAt?: string;

  @IsOptional()
  @IsDateString()
  submittedAt?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
