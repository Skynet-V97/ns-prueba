import { Injectable, NotFoundException } from '@nestjs/common';
import { CollectionDataRepository } from '../repositories/collection-data.repository';
import { CreateCollectionDataDto, UpdateCollectionDataDto } from '../dtos';

@Injectable()
export class CollectionDataService {
  constructor(private readonly repo: CollectionDataRepository) {}

  async findAll() {
    return await this.repo.findAll();
  }

  async findById(id: string) {
    const data = await this.repo.findById(id);
    if (!data) throw new NotFoundException(`CollectionData ${id} not found`);
    return data;
  }

  async create(dto: CreateCollectionDataDto) {
    return await this.repo.createCollection(dto);
  }

  async update(id: string, dto: UpdateCollectionDataDto) {
    return await this.repo.updateCollection(id, dto);
  }

  async remove(id: string) {
    return await this.repo.removeCollection(id);
  }
}
