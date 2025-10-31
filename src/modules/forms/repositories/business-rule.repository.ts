import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessRule } from '../entities/business-rule.entity';
import { CreateBusinessRuleDto, UpdateBusinessRuleDto } from '../dtos';

@Injectable()
export class BusinessRuleRepository {
  constructor(
    @InjectRepository(BusinessRule)
    private readonly repo: Repository<BusinessRule>,
  ) {}

  async findAll(): Promise<BusinessRule[]> {
    return await this.repo.find({ relations: ['form'] });
  }

  async findById(id: string): Promise<BusinessRule | null> {
    return await this.repo.findOne({
      where: { id },
      relations: ['form'],
    });
  }

  async createRule(dto: CreateBusinessRuleDto): Promise<BusinessRule> {
    const rule = this.repo.create(dto);
    return await this.repo.save(rule);
  }

  async updateRule(id: string, dto: UpdateBusinessRuleDto): Promise<BusinessRule> {
    await this.repo.update({ id }, dto);
    const updated = await this.findById(id);

    if (!updated) {
        throw new Error(`CollectionData with id ${id} not found`);
    }
    return updated;
  }

  async removeRule(id: string): Promise<void> {
    await this.repo.delete({ id });
  }
}
