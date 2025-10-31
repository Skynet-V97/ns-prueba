import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { CollectionDataService } from '../services/collection-data.service';
import { CreateCollectionDataDto, UpdateCollectionDataDto } from '../dtos';

@Controller('collection-data')
export class CollectionDataController {
  constructor(private readonly service: CollectionDataService) {}

  @Get()
  async findAll() {
    return await this.service.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.service.findById(id);
  }

  @Post()
  async create(@Body() dto: CreateCollectionDataDto) {
    return await this.service.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCollectionDataDto) {
    return await this.service.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.service.remove(id);
  }
}
