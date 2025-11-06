/*import {
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

}*/
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Form } from './form.entity';
import { FormSection } from './form-section.entity';
import { User } from './user.entity';
import { FormData } from './form-data.entity';
import { Exclude } from 'class-transformer';

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

  // Relación con Form (solo esta propiedad)
  @ManyToOne(() => Form, (form) => form.versions, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'formId' }) // Asocia la columna 'formId' con la relación Form
  @Exclude({ toPlainOnly: true }) // Excluir solo cuando se serializa a JSON
  form: Form;

  // Relación con el usuario que creó la versión
  @ManyToOne(() => User, (user) => user.formVersions, { nullable: true })
  @JoinColumn({ name: 'createdById' })
  createdBy: User | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  // Relación con las secciones del formulario
  @OneToMany(() => FormSection, (section) => section.formVersion)
  sections: FormSection[];

  // Relación con los datos del formulario
  @OneToMany(() => FormData, (data) => data.formVersion)
  formData: FormData[];

  // Snapshot del esquema del formulario en esa versión
  @Column({ type: 'jsonb' })
  schemaSnapshot: any;
}


