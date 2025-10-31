import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { FormField } from './form-field.entity';

@Entity('validation_rules')
export class ValidationRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // Ej: "required", "minLength", "regex"

  @Column({ nullable: true })
  expression: string; // Regex o expresión booleana

  @Column({ type: 'jsonb', nullable: true })
  parameters: any; // Parámetros adicionales para la validación

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => FormField, (field) => field.validationRules)
  field: FormField;
}
