import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany,
} from 'typeorm';
import { FormSection } from './form-section.entity';
import { FieldOption } from './field-option.entity';
import { ValidationRule } from './validation-rule.entity';
import { FieldDependency } from './field-dependency.entity';
import { CollectionTemplate } from './collection-template.entity';
import { FormAttachment } from './form-attachment.entity';
import { CollectionData } from './collection-data.entity';

@Entity('form_fields')
export class FormField {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string;

  @Column()
  label: string;

  @Column({ nullable: true })
  placeholder: string;

  @Column({ nullable: true })
  fieldType: string;

  @Column({ nullable: true })
  dataType: string;

  @Column({ type: 'int', default: 0 })
  orderIndex: number;

  @Column({ type: 'int', default: 1 })
  columnSpan: number;

  @Column({ default: false })
  isRequired: boolean;

  @Column({ default: false })
  isReadonly: boolean;

  @Column({ default: true })
  isVisible: boolean;

  @Column({ default: true })
  isEnabled: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @ManyToOne(() => FormSection, (section) => section.fields)
  section: FormSection;

  @ManyToOne(() => FormField, (field) => field.subFields, { nullable: true })
  parentField: FormField;

  @OneToMany(() => FormField, (field) => field.parentField)
  subFields: FormField[];

  @OneToMany(() => FieldOption, (opt) => opt.field)
  options: FieldOption[];

  @OneToMany(() => ValidationRule, (vr) => vr.field)
  validationRules: ValidationRule[];

  @OneToMany(() => FieldDependency, (dep) => dep.sourceField)
  dependencies: FieldDependency[];

  @OneToMany(() => CollectionTemplate, (tmpl) => tmpl.field)
  collectionTemplates: CollectionTemplate[];

  @OneToMany(() => FormAttachment, (attach) => attach.field)
  attachments: FormAttachment[];

  @OneToMany(() => CollectionData, (cd) => cd.field)
  collectionData: CollectionData[];
  uiConfig: any;
  optionsConfig: any;
}
