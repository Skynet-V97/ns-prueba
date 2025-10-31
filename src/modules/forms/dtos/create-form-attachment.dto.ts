// src/forms/dtos/create-form-attachment.dto.ts
import {
  IsUUID,
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsNotEmpty,
  IsInt,
} from 'class-validator';

export class CreateFormAttachmentDto {
  @IsUUID()
  formDataId: string;

  @IsOptional()
  @IsUUID()
  collectionDataId?: string | null;

  @IsOptional()
  @IsUUID()
  fieldId?: string | null;

  @IsString()
  @IsNotEmpty()
  fileName: string;

  @IsString()
  @IsNotEmpty()
  filePath: string;

  @IsString()
  @IsNotEmpty()
  fileType: string; // e.g., "image", "document"

  @IsOptional()
  @IsString()
  mimeType?: string;

  @IsOptional()
  @IsNumber()
  fileSize?: number; // bytes

  @IsOptional()
  @IsBoolean()
  isEncrypted?: boolean;
}
