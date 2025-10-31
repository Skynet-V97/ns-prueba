import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { BusinessRuleService } from '../services/business-rule.service';
import { CreateBusinessRuleDto, UpdateBusinessRuleDto } from '../dtos';

@Controller('business-rules')
export class BusinessRuleController {
  constructor(private readonly service: BusinessRuleService) {}

  @Get()
  async findAll() {
    return await this.service.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.service.findById(id);
  }

  @Post()
  async create(@Body() dto: CreateBusinessRuleDto) {
    return await this.service.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateBusinessRuleDto) {
    return await this.service.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.service.remove(id);
  }
}
