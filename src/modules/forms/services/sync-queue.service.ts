import { Injectable, NotFoundException } from '@nestjs/common';
import { SyncQueueRepository } from '../repositories/sync-queue.repository';
import { CreateSyncQueueDto, UpdateSyncQueueDto } from '../dtos';

@Injectable()
export class SyncQueueService {
  constructor(private readonly repo: SyncQueueRepository) {}

  async findAll() {
    return await this.repo.findAll();
  }

  async findById(id: string) {
    const queue = await this.repo.findById(id);
    if (!queue) throw new NotFoundException(`SyncQueue ${id} not found`);
    return queue;
  }

  async create(dto: CreateSyncQueueDto) {
    return await this.repo.createQueue(dto);
  }

  async update(id: string, dto: UpdateSyncQueueDto) {
    return await this.repo.updateQueue(id, dto);
  }

  async remove(id: string) {
    return await this.repo.removeQueue(id);
  }
}
