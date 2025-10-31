import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { FormVersionService } from '../services/form-version.service';
import { CreateFormVersionDto, UpdateFormVersionDto } from '../dtos';

@Controller('form-versions')
export class FormVersionController {
  constructor(private readonly formVersionService: FormVersionService) {}

  @Get()
  async findAll() {
    return await this.formVersionService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.formVersionService.findById(id);
  }

  @Post()
  async create(@Body() dto: CreateFormVersionDto) {
    return await this.formVersionService.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateFormVersionDto) {
    return await this.formVersionService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.formVersionService.remove(id);
  }
}
