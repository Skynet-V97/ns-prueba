import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { FormDataService } from '../services/form-data.service';
import { CreateFormDataDto, UpdateFormDataDto } from '../dtos';

@Controller('form-data')
export class FormDataController {
  constructor(private readonly service: FormDataService) {}

  @Get()
  async findAll() {
    return await this.service.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.service.findById(id);
  }

  @Post()
  async create(@Body() dto: CreateFormDataDto) {
    return await this.service.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateFormDataDto) {
    return await this.service.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.service.remove(id);
  }
}
