import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany,
} from 'typeorm';
import { FormField } from './form-field.entity';
import { FormAttachment } from './form-attachment.entity';
import { FormData } from './form-data.entity';

@Entity('collection_data')
export class CollectionData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'jsonb' })
  record: any; // Datos del registro (colección de valores)

  @ManyToOne(() => FormField, (field) => field.collectionData)
  field: FormField;

  @ManyToOne(() => FormData, (formData) => formData.collectionData)
  formData: FormData;

  @OneToMany(() => FormAttachment, (attach) => attach.collectionData)
  attachments: FormAttachment[];
}
