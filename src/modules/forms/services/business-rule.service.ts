import { Injectable, NotFoundException } from '@nestjs/common';
import { BusinessRuleRepository } from '../repositories/business-rule.repository';
import { CreateBusinessRuleDto, UpdateBusinessRuleDto } from '../dtos';

@Injectable()
export class BusinessRuleService {
  constructor(private readonly repo: BusinessRuleRepository) {}

  async findAll() {
    return await this.repo.findAll();
  }

  async findById(id: string) {
    const rule = await this.repo.findById(id);
    if (!rule) throw new NotFoundException(`BusinessRule ${id} not found`);
    return rule;
  }

  async create(dto: CreateBusinessRuleDto) {
    return await this.repo.createRule(dto);
  }

  async update(id: string, dto: UpdateBusinessRuleDto) {
    return await this.repo.updateRule(id, dto);
  }

  async remove(id: string) {
    return await this.repo.removeRule(id);
  }
}
