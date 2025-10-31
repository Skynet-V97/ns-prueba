import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { SyncQueueService } from '../services/sync-queue.service';
import { CreateSyncQueueDto, UpdateSyncQueueDto } from '../dtos';

@Controller('sync-queue')
export class SyncQueueController {
  constructor(private readonly service: SyncQueueService) {}

  @Get()
  async findAll() {
    return await this.service.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.service.findById(id);
  }

  @Post()
  async create(@Body() dto: CreateSyncQueueDto) {
    return await this.service.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateSyncQueueDto) {
    return await this.service.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.service.remove(id);
  }
}
