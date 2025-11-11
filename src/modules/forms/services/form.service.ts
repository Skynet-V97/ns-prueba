// src/modules/forms/services/form.service.ts
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateFormDto, UpdateFormDto } from '../dtos';
import { FormRepository } from '../repositories/form.repository';
import { Form, FormField, FormSection, ValidationRule } from '../entities';

@Injectable()
export class FormService {
  constructor(private readonly formRepository: FormRepository) {}

  // Método para obtener todos los formularios
  async findAll(page: number = 1, limit: number = 10) {
    try {
      return await this.formRepository.findAll(page, limit);
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener formularios');
    }
  }

  // Método para obtener un formulario por ID
  async findById(id: string) {
    const form = await this.formRepository.findById(id);
    if (!form) throw new NotFoundException(`Formulario con ID ${id} no encontrado`);
    return form;
  }

  // Método para crear un nuevo formulario
  async create(dto: CreateFormDto) {
    //return await this.formRepository.createForm(dto);
    try {
      return await this.formRepository.createForm(dto);
    } catch (error) {
      throw new InternalServerErrorException('Error al crear el formulario');
    }
  }

  // Método para actualizar un formulario
  async update(id: string, dto: UpdateFormDto) {
    const form = await this.formRepository.findById(id);
    if (!form) throw new NotFoundException(`Formulario con ID ${id} no encontrado`);
    
    try {
      return await this.formRepository.updateForm(id, dto);
    } catch (error) {
      throw new InternalServerErrorException('Error al actualizar el formulario');
    }
  }




  // Método para eliminar un formulario
  async remove(id: string): Promise<void> {
    const form = await this.formRepository.findById(id);
    if (!form) throw new NotFoundException(`Formulario con ID ${id} no encontrado`);
    
    try {
      await this.formRepository.removeForm(id);
    } catch (error) {
      throw new InternalServerErrorException('Error al eliminar el formulario');
    }
  }
}
