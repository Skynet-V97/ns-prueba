import { Injectable, NotFoundException } from '@nestjs/common';
import { FormDataRepository } from '../repositories/form-data.repository';
import { CreateFormDataDto, UpdateFormDataDto } from '../dtos';

@Injectable()
export class FormDataService {
  constructor(private readonly repo: FormDataRepository) {}

  async findAll() {
    return await this.repo.findAll();
  }

  async findById(id: string) {
    const data = await this.repo.findById(id);
    if (!data) throw new NotFoundException(`FormData ${id} not found`);
    return data;
  }

  async create(dto: CreateFormDataDto) {
    return await this.repo.createFormData(dto);
  }

  async update(id: string, dto: UpdateFormDataDto) {
    return await this.repo.updateFormData(id, dto);
  }

  async remove(id: string) {
    return await this.repo.removeFormData(id);
  }
}
