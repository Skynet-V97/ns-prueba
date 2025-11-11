import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
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

  /**
   * Permite guardar cualquier configuración extra del campo
   * como validaciones dinámicas, longitudes, mensajes, etc.
   */
  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  /**
   * Configuración visual del campo (iconos, placeholders, etc.)
   * Esto es esencial para tu JSON de ejemplo.
   */
  @Column({ type: 'jsonb', nullable: true })
  uiConfig: Record<string, any>;

  /**
   * Configuración adicional para opciones (listas desplegables, etc.)
   */
  @Column({ type: 'jsonb', nullable: true })
  optionsConfig: Record<string, any>;

  /**
   * Relación con la sección a la que pertenece este campo
   * onDelete: 'CASCADE' garantiza que si se elimina la sección,
   * también se eliminan sus campos.
   */
  @ManyToOne(() => FormSection, (section) => section.fields, {
    onDelete: 'CASCADE',
  })
  section: FormSection;

  /**
   * Campos anidados o compuestos (como collections)
   */
  @ManyToOne(() => FormField, (field) => field.subFields, { nullable: true, onDelete: 'CASCADE' })
  parentField: FormField;

  @OneToMany(() => FormField, (field) => field.parentField, {
    cascade: true, // para permitir subFields anidados
  })
  subFields: FormField[];

  /**
   * Opciones disponibles (solo para campos tipo select, radio, etc.)
   */
  @OneToMany(() => FieldOption, (opt) => opt.field, { cascade: true })
  options: FieldOption[];

  /**
   * Reglas de validación específicas del campo
   */
  @OneToMany(() => ValidationRule, (vr) => vr.field, { cascade: true, onDelete: 'CASCADE' })
  validationRules: ValidationRule[];

  /**
   * Dependencias entre campos (por ejemplo, city depende de province)
   */
  @OneToMany(() => FieldDependency, (dep) => dep.sourceField, { cascade: true })
  dependencies: FieldDependency[];

  /**
   * Configuración para colecciones o tablas dentro del formulario
   */
  @OneToMany(() => CollectionTemplate, (tmpl) => tmpl.field, { cascade: true })
  collectionTemplates: CollectionTemplate[];

  /**
   * Archivos adjuntos asociados a este campo
   */
  @OneToMany(() => FormAttachment, (attach) => attach.field, { cascade: true })
  attachments: FormAttachment[];

  /**
   * Datos de colección (valores dinámicos)
   */
  @OneToMany(() => CollectionData, (cd) => cd.field, { cascade: true })
  collectionData: CollectionData[];
}
