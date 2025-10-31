// src/forms/dtos/create-business-rule.dto.ts
import {
  IsUUID,
  IsString,
  IsOptional,
  IsNotEmpty,
  IsInt,
  IsBoolean,
  IsObject,
} from 'class-validator';

export class CreateBusinessRuleDto {
  @IsUUID()
  formId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  /**
   * condition can be a plain text expression or a structured JSON.
   * If you prefer strict structure, change to IsObject and define the DTO.
   */
  @IsOptional()
  @IsString()
  condition?: string | null;

  @IsObject()
  @IsNotEmpty()
  actions: Record<string, any>; // estructura de acciones (targetField, setValue, etc.)

  @IsOptional()
  @IsInt()
  priority?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
