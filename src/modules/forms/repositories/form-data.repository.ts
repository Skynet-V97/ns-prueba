import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FormData } from '../entities/form-data.entity';
import { CreateFormDataDto, UpdateFormDataDto } from '../dtos';

@Injectable()
export class FormDataRepository {
  constructor(
    @InjectRepository(FormData)
    private readonly repo: Repository<FormData>,
  ) {}

  async findAll(): Promise<FormData[]> {
    return await this.repo.find({
      relations: ['form', 'user', 'attachments', 'collectionData', 'syncQueue'],
    });
  }

  async findById(id: string): Promise<FormData | null> {
    return await this.repo.findOne({
      where: { id },
      relations: ['form', 'user', 'attachments', 'collectionData', 'syncQueue'],
    });
  }

  async createFormData(dto: CreateFormDataDto): Promise<FormData> {
    const data = this.repo.create(dto);
    return await this.repo.save(data);
  }

  async updateFormData(id: string, dto: UpdateFormDataDto): Promise<FormData> {
    await this.repo.update({ id }, dto);
    const updated = await this.findById(id);
    if (!updated) {
        throw new Error(`FormData with id ${id} not found`);
    }
    return updated;
  }


  async removeFormData(id: string): Promise<void> {
    await this.repo.delete({ id });
  }
}
