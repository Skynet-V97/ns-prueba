import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollectionData } from '../entities/collection-data.entity';
import { CreateCollectionDataDto, UpdateCollectionDataDto } from '../dtos';

@Injectable()
export class CollectionDataRepository {
  constructor(
    @InjectRepository(CollectionData)
    private readonly repo: Repository<CollectionData>,
  ) {}

  async findAll(): Promise<CollectionData[]> {
    return await this.repo.find({ relations: ['formData', 'attachments'] });
  }

  async findById(id: string): Promise<CollectionData | null> {
    return await this.repo.findOne({
      where: { id },
      relations: ['formData', 'attachments'],
    });
  }

  async createCollection(dto: CreateCollectionDataDto): Promise<CollectionData> {
    const data = this.repo.create(dto);
    return await this.repo.save(data);
  }

  async updateCollection(id: string, dto: UpdateCollectionDataDto): Promise<CollectionData> {
    await this.repo.update({ id }, dto);
    const updated = await this.findById(id);

    if (!updated) {
        throw new Error(`CollectionData with id ${id} not found`);
    }

    return updated;
  }


  async removeCollection(id: string): Promise<void> {
    await this.repo.delete({ id });
  }
}
