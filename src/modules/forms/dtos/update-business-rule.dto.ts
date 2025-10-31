// src/forms/dtos/update-business-rule.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateBusinessRuleDto } from './create-business-rule.dto';

export class UpdateBusinessRuleDto extends PartialType(CreateBusinessRuleDto) {}
