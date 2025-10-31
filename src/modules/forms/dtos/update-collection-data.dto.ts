// src/forms/dtos/update-collection-data.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateCollectionDataDto } from './create-collection-data.dto';

export class UpdateCollectionDataDto extends PartialType(CreateCollectionDataDto) {}
