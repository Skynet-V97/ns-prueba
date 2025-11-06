// src/modules/forms/controllers/form.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  NotFoundException,
  Patch,
} from '@nestjs/common';
import { FormService } from '../services/form.service';
import { CreateFormDto, UpdateFormDto } from '../dtos';

@Controller('forms')
export class FormController {
  constructor(private readonly formService: FormService) {}

  /*@Get()
  async findAll() {
    return await this.formService.findAll();
  }*/
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    // Convierte los parámetros a número por seguridad
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;

    return this.formService.findAll(pageNum, limitNum);
  }


  @Get(':id')
  async findById(@Param('id') id: string) {
    const form = await this.formService.findById(id);

    if (!form) {
      throw new NotFoundException(`Formulario con ID ${id} no encontrado`);
    }

    return form;
  }

  @Post()
  async create(@Body() dto: CreateFormDto) {
    // Recibe todo el JSON del formulario
    return await this.formService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateFormDto) {
    return await this.formService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.formService.remove(id);
    return { message: `Formulario con ID ${id} eliminado correctamente` };
  }

}
