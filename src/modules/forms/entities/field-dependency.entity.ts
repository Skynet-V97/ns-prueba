import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { FormField } from './form-field.entity';

@Entity('field_dependencies')
export class FieldDependency {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => FormField, (field) => field.dependencies)
  sourceField: FormField; // campo origen que controla otro

  @ManyToOne(() => FormField, { nullable: false })
  targetField: FormField; // campo dependiente

  @Column({ type: 'text', nullable: true })
  condition: string; // Ej: "sourceField.value === 'YES'"

  @Column({ type: 'jsonb', nullable: true })
  actions: any; // Ej: { show: true, enable: false }

  @Column({ default: true })
  isActive: boolean;
}
