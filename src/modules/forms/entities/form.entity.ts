import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { FormVersion } from './form-version.entity';
import { BusinessRule } from './business-rule.entity';
import { FormData } from './form-data.entity';
import { FormSection } from './form-section.entity';
import { Exclude } from 'class-transformer';

@Entity('forms')
export class Form {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  tipo: string;

  // Relación con la entidad User (quien creó el formulario)
  @ManyToOne(() => User, (user) => user.forms, { nullable: true })
  createdBy: User;

  // Fecha de creación
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  // Relación uno a muchos con FormVersion
  //@OneToMany(() => FormVersion, (formVersion) => formVersion.form)
  @OneToMany(() => FormVersion, (version) => version.form)
  @Exclude({ toPlainOnly: true }) // Excluir solo cuando se serializa a JSON
  versions: FormVersion[];

  // Relación uno a muchos con BusinessRule
  @OneToMany(() => BusinessRule, (rule) => rule.form)
  businessRules: BusinessRule[];

  // Relación uno a muchos con FormData
  @OneToMany(() => FormData, (data) => data.form)
  formData: FormData[];

  // Relación uno a muchos con FormSection
  @OneToMany(() => FormSection, (section) => section.form, { eager: true })
  sections: FormSection[];

  // Agrega una propiedad para manejar los "settings" si es necesario
  @Column({ type: 'json', nullable: true })
  settings: Record<string, any>;

  // Metadatos o reglas adicionales (si es necesario)
  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;
}
