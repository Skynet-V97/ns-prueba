import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FormVersion } from '../entities/form-version.entity';
import { Form } from '../entities/form.entity';
import { CreateFormVersionDto, UpdateFormVersionDto } from '../dtos';
import { User } from '../entities';

@Injectable()
export class FormVersionRepository {
  constructor(
    @InjectRepository(FormVersion)
    private readonly repo: Repository<FormVersion>,

    @InjectRepository(Form)
    private readonly formRepo: Repository<Form>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findAll(): Promise<FormVersion[]> {
    return await this.repo.find({
      //relations: ['form', 'createdByUser'], // ajusta las relaciones según tu entidad
      relations: ['createdByUser'],
    });
  }

  async findById(id: string): Promise<FormVersion | null> {
    return await this.repo.findOne({
      where: { id },
      //relations: ['form', 'createdByUser'],
      relations: ['createdByUser'],
    });
  }

  async createFormVersion(dto: CreateFormVersionDto): Promise<FormVersion> {
    // Buscar el formulario
    const form = await this.formRepo.findOne({ where: { id: dto.formId } });
    if (!form) throw new Error('Formulario no encontrado');

    // Buscar el usuario creador
    const user = await this.userRepo.findOne({ where: { id: dto.createdBy } });
    if (!user) throw new Error('Usuario no encontrado');

    // Crear la versión del formulario
    const formVersion = this.repo.create({
      form,
      versionNumber: dto.versionNumber,
      schemaSnapshot: dto.schemaSnapshot, // asegúrate de que esté declarado en la entidad
      changelog: dto.changelog ?? '',
      createdBy: user,
      isCurrent: dto.isCurrent ?? false,
      createdAt: new Date(),
    });

    return await this.repo.save(formVersion);
  }


  async updateFormVersion(id: string, dto: UpdateFormVersionDto): Promise<FormVersion> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new Error('Versión de formulario no encontrada');
    }

    Object.assign(existing, dto);

    await this.repo.save(existing);
    return existing;
  }

  async removeFormVersion(id: string): Promise<void> {
    await this.repo.delete({ id });
  }
}
