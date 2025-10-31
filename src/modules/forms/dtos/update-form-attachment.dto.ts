// src/forms/dtos/update-form-attachment.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateFormAttachmentDto } from './create-form-attachment.dto';

export class UpdateFormAttachmentDto extends PartialType(CreateFormAttachmentDto) {}
