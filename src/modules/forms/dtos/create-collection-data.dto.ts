// src/forms/dtos/create-collection-data.dto.ts
import {
  IsUUID,
  IsObject,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
} from 'class-validator';

export class CreateCollectionDataDto {
  @IsUUID()
  formDataId: string;

  @IsUUID()
  fieldId: string; // field that defines the collection

  @IsObject()
  @IsNotEmpty()
  record: Record<string, any>; // contenido del elemento de la colección

  @IsOptional()
  @IsString()
  createdBy?: string;
}
