import {
  Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne,
} from 'typeorm';
import { User } from './user.entity';
import { FormVersion } from './form-version.entity';
import { BusinessRule } from './business-rule.entity';
import { FormData } from './form-data.entity';

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

  @ManyToOne(() => User, (user) => user.forms)
  createdBy: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => FormVersion, (version) => version.form)
  versions: FormVersion[];

  @OneToMany(() => BusinessRule, (rule) => rule.form)
  businessRules: BusinessRule[];

  @OneToMany(() => FormData, (data) => data.form)
  formData: FormData[];
}
