import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SyncQueue } from '../entities/sync-queue.entity';
import { CreateSyncQueueDto, UpdateSyncQueueDto } from '../dtos';

@Injectable()
export class SyncQueueRepository {
  constructor(
    @InjectRepository(SyncQueue)
    private readonly repo: Repository<SyncQueue>,
  ) {}

  async findAll(): Promise<SyncQueue[]> {
    return await this.repo.find({ relations: ['formData', 'user'] });
  }

  async findById(id: string): Promise<SyncQueue | null> {
    return await this.repo.findOne({
      where: { id },
      relations: ['formData', 'user'],
    });
  }

  async createQueue(dto: CreateSyncQueueDto): Promise<SyncQueue> {
    const queue = this.repo.create(dto);
    return await this.repo.save(queue);
  }

  async updateQueue(id: string, dto: UpdateSyncQueueDto): Promise<SyncQueue | null> {
    const queue = await this.findById(id);
    if (!queue) {
        return null;  // O manejas el caso según tu lógica
    }

    await this.repo.update({ id }, dto);
    return await this.findById(id);
  }

  async removeQueue(id: string): Promise<void> {
    await this.repo.delete({ id });
  }
}
