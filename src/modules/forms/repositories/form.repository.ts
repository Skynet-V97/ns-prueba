import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Form } from '../entities/form.entity';
import { CreateFormDto, UpdateFormDto } from '../dtos';

@Injectable()
export class FormRepository {
  constructor(
    @InjectRepository(Form)
    private readonly formRepo: Repository<Form>,
  ) {}

  async findAll(): Promise<Form[]> {
    return await this.formRepo.find({
      relations: ['sections', 'businessRules', 'formVersions'],
    });
  }

  async findById(id: string): Promise<Form | null> {
    return await this.formRepo.findOne({
      where: { id },
      relations: ['sections', 'businessRules', 'formVersions'],
    });
  }

  async createForm(dto: CreateFormDto): Promise<Form> {
    const form = this.formRepo.create(dto);
    return await this.formRepo.save(form);
  }

  async updateForm(id: string, dto: UpdateFormDto): Promise<Form | null> {
    const form = await this.findById(id);
    if (!form) {
      throw new Error('Form not found');
    }
    await this.formRepo.update({ id }, dto);
    return form;
  }


  async removeForm(id: string): Promise<void> {
    await this.formRepo.delete({ id });
  }
}
