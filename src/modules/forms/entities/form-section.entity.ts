import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { FormVersion } from './form-version.entity';
import { FormField } from './form-field.entity';
import { Form } from './form.entity';

@Entity('form_sections')
export class FormSection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string;

  @Column()
  title: string;

  //@Column({ type: 'int', default: 0 })
  //orderIndex: number;
  @Column({ type: 'int', nullable: true })
  orderIndex: number | null; // Hacerlo opcional


  @Column({ type: 'int', nullable: true , default: 1 })
  columns: number | null;

  @Column({ default: true })
  isVisible: boolean;

  // Relación recursiva con subsecciones (parentSection <-> subSections)
  @ManyToOne(() => FormSection, (section) => section.subSections, { nullable: true })
  parentSection: FormSection;

  @OneToMany(() => FormSection, (section) => section.parentSection, { cascade: true, lazy: true })
  subSections: FormSection[];

  // Relación con FormVersion (un FormSection pertenece a una única versión de formulario)
  //@ManyToOne(() => FormVersion, (version) => version.sections)
  //formVersion: FormVersion;
  @ManyToOne(() => FormVersion, (version) => version.sections, { cascade: true, lazy: true })
  formVersion?: FormVersion;
  //@Column({ type: 'uuid', nullable: true })
  //formVersion: string;

  // Relación con los campos del formulario
  @OneToMany(() => FormField, (field) => field.section, { cascade: true, lazy: true })
  fields: FormField[];

  // Relación con Form (un FormSection pertenece a un único Form)
  @ManyToOne(() => Form, (form) => form.sections, { nullable: true, onDelete: 'CASCADE' })
  form: Form;

  // Descripción de la sección, ahora con tipo string en lugar de any
  @Column({ type: 'text', nullable: true })
  description: string;
}

