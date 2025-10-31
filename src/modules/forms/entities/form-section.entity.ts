import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany,
} from 'typeorm';
import { FormVersion } from './form-version.entity';
import { FormField } from './form-field.entity';

@Entity('form_sections')
export class FormSection {
  //@PrimaryGeneratedColumn()
  
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string;

  @Column()
  title: string;

  @Column({ type: 'int', default: 0 })
  orderIndex: number;

  @Column({ type: 'int', default: 1 })
  columns: number;

  @Column({ default: true })
  isVisible: boolean;

  @ManyToOne(() => FormSection, (section) => section.subSections, { nullable: true })
  parentSection: FormSection;

  @OneToMany(() => FormSection, (section) => section.parentSection)
  subSections: FormSection[];

  @ManyToOne(() => FormVersion, (version) => version.sections)
  formVersion: FormVersion;

  @OneToMany(() => FormField, (field) => field.section)
  fields: FormField[];
}
