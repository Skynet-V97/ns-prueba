import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Form } from './form.entity';
import { FormVersion } from './form-version.entity';
import { SyncQueue } from './sync-queue.entity';
import { FormAttachment } from './form-attachment.entity';
import { CollectionData } from './collection-data.entity';

@Entity('form_data')
export class FormData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'jsonb' })
  data: any; // Datos completos del formulario (estructura dinámica)

  @Column({ type: 'text', nullable: true })
  status: string; // Ej: "draft", "submitted", "synced"

  @ManyToOne(() => User, (user) => user.formData)
  user: User;

  @ManyToOne(() => Form, (form) => form.formData)
  form: Form;

  @ManyToOne(() => FormVersion, (version) => version.formData)
  formVersion: FormVersion;

  @OneToMany(() => FormAttachment, (attach) => attach.formData)
  attachments: FormAttachment[];

  @OneToMany(() => CollectionData, (cd) => cd.formData)
  collectionData: CollectionData[];

  @OneToMany(() => SyncQueue, (sq) => sq.formData)
  syncQueue: SyncQueue[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
