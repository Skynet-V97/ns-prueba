import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FormAttachment } from '../entities/form-attachment.entity';
import { CreateFormAttachmentDto, UpdateFormAttachmentDto } from '../dtos';

@Injectable()
export class FormAttachmentRepository {
  constructor(
    @InjectRepository(FormAttachment)
    private readonly repo: Repository<FormAttachment>,
  ) {}

  async findAll(): Promise<FormAttachment[]> {
    return await this.repo.find({ relations: ['formData', 'collectionData', 'formField'] });
  }

  async findById(id: string): Promise<FormAttachment | null> {
    return await this.repo.findOne({
      where: { id },
      relations: ['formData', 'collectionData', 'formField'],
    });
  }

  async createAttachment(dto: CreateFormAttachmentDto): Promise<FormAttachment> {
    const entity = this.repo.create(dto);
    return await this.repo.save(entity);
  }

  async updateAttachment(id: string, dto: UpdateFormAttachmentDto): Promise<FormAttachment> {
    await this.repo.update({ id }, dto);
    const updated = await this.findById(id);
    
    if (!updated) {
        throw new Error(`FormAttachment with id ${id} not found`);
    }

    return updated;
  }


  async removeAttachment(id: string): Promise<void> {
    await this.repo.delete({ id });
  }
}
