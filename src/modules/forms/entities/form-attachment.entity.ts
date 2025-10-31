import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne,
} from 'typeorm';
import { FormData } from './form-data.entity';
import { FormField } from './form-field.entity';
import { CollectionData } from './collection-data.entity';

@Entity('form_attachments')
export class FormAttachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fileName: string;

  @Column()
  fileType: string;

  @Column({ nullable: true })
  fileSize: number;

  @Column()
  filePath: string;

  @Column({ nullable: true })
  mimeType: string;

  @Column({ default: false })
  isEncrypted: boolean;

  @ManyToOne(() => FormData, (formData) => formData.attachments)
  formData: FormData;

  @ManyToOne(() => CollectionData, (cd) => cd.attachments, { nullable: true })
  collectionData: CollectionData;

  @ManyToOne(() => FormField, (field) => field.attachments, { nullable: true })
  field: FormField;
}
