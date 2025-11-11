import { Expose, Type } from 'class-transformer';

class FormVersionResponseDto {
  @Expose() id: string;
  @Expose() versionNumber: number;
  @Expose() changelog: string;
  @Expose() isCurrent: boolean;
  @Expose() createdAt: Date;
}

export class FormResponseDto {
  @Expose() id: string;
  @Expose() code: string;
  @Expose() name: string;
  @Expose() description: string;
  @Expose() tipo: string;
  @Expose() settings: any;
  @Expose() metadata: any;
  @Expose() createdAt: Date;

  @Type(() => FormVersionResponseDto)
  @Expose() versions: FormVersionResponseDto[];
}
