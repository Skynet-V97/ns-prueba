// src/modules/forms/controllers/form.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { FormService } from '../services/form.service';
import { CreateFormDto, UpdateFormDto } from '../dtos';

@Controller('forms')
export class FormController {
  constructor(private readonly formService: FormService) {}

  @Get()
  async findAll() {
    return await this.formService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.formService.findById(id);
  }

  @Post()
  async create(@Body() dto: CreateFormDto) {
    // Recibe todo el JSON del formulario
    return await this.formService.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateFormDto) {
    return await this.formService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.formService.remove(id);
  }
}
