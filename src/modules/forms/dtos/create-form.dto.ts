// src/modules/forms/dtos/create-form.dto.ts
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

class FormSettingsDto {
  @IsOptional() @IsBoolean() audited?: boolean;
  @IsOptional() @IsBoolean() allowDraft?: boolean;
  @IsOptional() @IsBoolean() autoSave?: boolean;
  @IsOptional() @IsString() submitLabel?: string;
  @IsOptional() @IsString() cancelLabel?: string;
  @IsOptional() @IsNumber() autoSaveInterval?: number | null;
}

class FieldOptionDto {
  @IsString() value: string;
  @IsString() label: string;
  @IsOptional() @IsNumber() orderIndex?: number;
  @IsOptional() @IsBoolean() isDefault?: boolean;
  @IsOptional() @IsObject() metadata?: Record<string, any>;
}

class FormFieldDto {
  @IsString() id: string;
  @IsString() code: string;
  @IsString() label: string;
  @IsOptional() @IsString() placeholder?: string;
  @IsOptional() @IsString() fieldType?: string;
  @IsOptional() @IsString() dataType?: string;
  @IsOptional() @IsNumber() orderIndex?: number;
  @IsOptional() @IsBoolean() isRequired?: boolean;
  @IsOptional() @IsObject() validationRules?: Record<string, any>;
  @IsOptional() @IsObject() uiConfig?: Record<string, any>;
  @IsOptional() @IsObject() optionsConfig?: {
    type?: string;
    endpoint?: string;
    options?: FieldOptionDto[];
  };
}

class FormSectionDto {
  @IsString() id: string;
  @IsString() code: string;
  @IsString() title: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsNumber() orderIndex?: number;
  @IsOptional() @IsBoolean() isVisible?: boolean;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormFieldDto)
  fields: FormFieldDto[];
}

class BusinessRuleDto {
  @IsString() id: string;
  @IsString() name: string;
  @IsString() ruleType: string;
  @IsString() triggerEvent: string;
  @IsOptional() @IsArray() triggerFields?: string[];
  @IsOptional() @IsObject() action?: Record<string, any>;
  @IsOptional() @IsNumber() priority?: number;
}

export class CreateFormDto {
  @IsString() id: string;
  @IsString() code: string;
  @IsString() name: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsNumber() version?: number;

  @ValidateNested()
  @Type(() => FormSettingsDto)
  settings: FormSettingsDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormSectionDto)
  sections: FormSectionDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BusinessRuleDto)
  rules: BusinessRuleDto[];

  @IsOptional() @IsObject() metadata?: Record<string, any>;
}
