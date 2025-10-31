import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { FormField } from './form-field.entity';

@Entity('collection_templates')
export class CollectionTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  templateName: string;

  @Column({ type: 'jsonb', nullable: true })
  structure: any; // Estructura de la plantilla (campos, tipos, etc.)

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => FormField, (field) => field.collectionTemplates)
  field: FormField;
}
