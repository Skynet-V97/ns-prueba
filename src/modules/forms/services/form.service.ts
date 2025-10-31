// src/modules/forms/services/form.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFormDto, UpdateFormDto } from '../dtos';
import { FormRepository } from '../repositories/form.repository';

@Injectable()
export class FormService {
  constructor(private readonly formRepository: FormRepository) {}

  async findAll() {
    return this.formRepository.findAll();
  }

  async findById(id: string) {
    const form = await this.formRepository.findById(id);
    if (!form) throw new NotFoundException(`Formulario con ID ${id} no encontrado`);
    return form;
  }

  async create(dto: CreateFormDto) {
    // Enviar DTO completo (estructura JSON)
    return await this.formRepository.createForm(dto);
  }

  async update(id: string, dto: UpdateFormDto) {
    return await this.formRepository.updateForm(id, dto);
  }

  async remove(id: string) {
    return await this.formRepository.removeForm(id);
  }
}
