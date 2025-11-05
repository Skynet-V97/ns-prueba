/*import { Injectable, NotFoundException } from '@nestjs/common';
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
}*/

import { Injectable, NotFoundException } from '@nestjs/common';
import { FormVersionRepository } from '../repositories/form-version.repository';
import { CreateFormVersionDto, UpdateFormVersionDto } from '../dtos';

@Injectable()
export class FormVersionService {
  constructor(private readonly repo: FormVersionRepository) {}

  async findAll() {
    // Asegurarse de que las relaciones cíclicas no se serialicen
    const formVersions = await this.repo.findAll();

    // Transformar las versiones de formulario para excluir propiedades no deseadas
    return formVersions.map(version => {
      const { form, ...versionWithoutForm } = version;
      return versionWithoutForm;  // Excluir la propiedad form al devolver la versión
    });
  }

  async findById(id: string) {
    const version = await this.repo.findById(id);
    if (!version) throw new NotFoundException(`FormVersion ${id} not found`);

    // Similar a findAll, se excluye la propiedad form
    const { form, ...versionWithoutForm } = version;
    return versionWithoutForm;
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

