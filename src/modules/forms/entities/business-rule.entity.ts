import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Form } from './form.entity';

@Entity('business_rules')
export class BusinessRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text' })
  condition: string | null; // Condición a evaluar (ej: "form.total > 100")

  @Column({ type: 'jsonb', nullable: true })
  actions: any; // Ej: { showField: 'discount', setValue: 10 }

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Form, (form) => form.businessRules)
  form: Form;
}
