import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { FormData } from './form-data.entity';

@Entity('sync_queue')
export class SyncQueue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  operationType: string; // Ej: "CREATE", "UPDATE", "DELETE"

  @Column({ type: 'jsonb' })
  payload: any; // Datos que deben sincronizarse

  @Column({ default: false })
  isSynced: boolean;

  @Column({ nullable: true })
  syncedAt: Date;

  @ManyToOne(() => User, (user) => user.syncQueues)
  user: User;

  @ManyToOne(() => FormData, (formData) => formData.syncQueue)
  formData: FormData;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
