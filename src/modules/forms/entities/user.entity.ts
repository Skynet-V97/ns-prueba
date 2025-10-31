import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Form } from './form.entity';
import { FormData } from './form-data.entity';
import { SyncQueue } from './sync-queue.entity';
import { FormVersion } from './form-version.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => Form, (form) => form.createdBy)
  forms: Form[];

  @OneToMany(() => FormData, (data) => data.user)
  formData: FormData[];

  @OneToMany(() => SyncQueue, (queue) => queue.user)
  syncQueues: SyncQueue[];

  @OneToMany(() => FormVersion, (version) => version.createdBy)
  formVersions: FormVersion[];
}
