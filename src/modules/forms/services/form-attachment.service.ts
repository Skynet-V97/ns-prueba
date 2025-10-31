import { Injectable, NotFoundException } from '@nestjs/common';
import { FormAttachmentRepository } from '../repositories/form-attachment.repository';
import { CreateFormAttachmentDto, UpdateFormAttachmentDto } from '../dtos';

@Injectable()
export class FormAttachmentService {
  constructor(private readonly repo: FormAttachmentRepository) {}

  async findAll() {
    return await this.repo.findAll();
  }

  async findById(id: string) {
    const file = await this.repo.findById(id);
    if (!file) throw new NotFoundException(`FormAttachment ${id} not found`);
    return file;
  }

  async create(dto: CreateFormAttachmentDto) {
    return await this.repo.createAttachment(dto);
  }

  async update(id: string, dto: UpdateFormAttachmentDto) {
    return await this.repo.updateAttachment(id, dto);
  }

  async remove(id: string) {
    return await this.repo.removeAttachment(id);
  }
}
