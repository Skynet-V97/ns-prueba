import { IsUUID, IsInt, IsOptional, IsBoolean, IsJSON, IsString } from 'class-validator';

export class CreateFormVersionDto {
  @IsUUID()
  formId: string;

  @IsInt()
  versionNumber: number;

  @IsJSON()
  schemaSnapshot: object;

  @IsOptional()
  @IsString()
  changelog?: string;

  @IsUUID()
  createdBy: string;

  @IsOptional()
  @IsBoolean()
  isCurrent?: boolean;
}
