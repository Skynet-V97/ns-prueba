import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { FormField } from './form-field.entity';

@Entity('field_options')
export class FieldOption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  value: string;

  @Column()
  label: string;

  @Column({ type: 'int', default: 0 })
  orderIndex: number;

  @Column({ default: false })
  isDefault: boolean;

  @Column({ nullable: true })
  parentValue: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @ManyToOne(() => FormField, (field) => field.options)
  field: FormField;
}
