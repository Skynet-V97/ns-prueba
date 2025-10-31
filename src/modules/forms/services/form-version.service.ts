import { Injectable, NotFoundException } from '@nestjs/common';
import { FormVersionRepository } from '../repositories/form-version.repository';
import { CreateFormVersionDto, UpdateFormVersionDto } from '../dtos';

@Injectable()
export class FormVersionService {
  constructor(private readonly repo: FormVersionRepository) {}

  async findAll() {
    return await this.repo.findAll();
  }

  async findById(id: string) {
    const version = await this.repo.findById(id);
    if (!version) throw new NotFoundException(`FormVersion ${id} not found`);
    return version;
  }

  async create(dto: CreateFormVersionDto) {
    return await this.repo.createFormVersion(dto);
  }

  async update(id: string, dto: UpdateFormVersionDto) {
    return await this.repo.updateFormVersion(id, dto);
  }

  async remove(id: string) {
    return await this.repo.removeFormVersion(id);
  }
}
