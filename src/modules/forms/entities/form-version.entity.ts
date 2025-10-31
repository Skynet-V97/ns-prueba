import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany,
} from 'typeorm';
import { Form } from './form.entity';
import { FormSection } from './form-section.entity';
import { User } from './user.entity';
import { FormData } from './form-data.entity';

@Entity('form_versions')
export class FormVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  versionNumber: number;

  @Column({ type: 'text', nullable: true })
  changelog: string;

  @Column({ default: true })
  isCurrent: boolean;

  @ManyToOne(() => Form, (form) => form.versions)
  form: Form;

  @ManyToOne(() => User, (user) => user.formVersions)
  createdBy: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => FormSection, (section) => section.formVersion)
  sections: FormSection[];

  @OneToMany(() => FormData, (data) => data.formVersion)
  formData: FormData[];

  @Column({ type: 'jsonb' })
  schemaSnapshot: any;

}
