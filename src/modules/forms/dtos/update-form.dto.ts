import { PartialType } from '@nestjs/mapped-types';
import { CreateFormDto } from './create-form.dto';

export class UpdateFormDto extends PartialType(CreateFormDto) {}

//IMPLEMENTACION HIPOTETICA PARA AFECTAR A CAMPOR RELACIONADOS (section, fields, validations-rules)
/*import { IsOptional, IsString, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class UpdateFormFieldDto {
  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @IsString()
  placeholder?: string;

  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;

  @IsOptional()
  metadata?: any;

  @IsOptional()
  uiConfig?: any;

  @IsOptional()
  optionsConfig?: any;
  validationRules: any;
  id: any;
}

class UpdateFormSectionDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateFormFieldDto)
  fields?: UpdateFormFieldDto[];
  id: any;
}

export class UpdateFormDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  settings?: any;

  @IsOptional()
  metadata?: any;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateFormSectionDto)
  sections?: UpdateFormSectionDto[];
}
*/