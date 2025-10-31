import { PartialType } from '@nestjs/mapped-types';
import { CreateFormVersionDto } from './create-form-version.dto';
import { IsOptional, IsString, IsUUID, IsBoolean, IsNumber } from 'class-validator';
import { Form } from '../entities/form.entity'; // Ruta relativa correcta

export class UpdateFormVersionDto extends PartialType(CreateFormVersionDto) {
  @IsOptional()
  @IsUUID()
  createdBy?: string;

  @IsOptional()
  @IsNumber()
  versionNumber?: number;

  @IsOptional()
  @IsString()
  changelog?: string;

  @IsOptional()
  @IsBoolean()
  isCurrent?: boolean;

  @IsOptional()
  form?: Form;  // Este es el tipo correcto para el campo 'form'
}

