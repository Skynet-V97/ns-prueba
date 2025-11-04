import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Form } from '../entities/form.entity';
import { CreateFormDto, UpdateFormDto } from '../dtos';
import { FormSection } from '../entities/form-section.entity';
import { FormField } from '../entities/form-field.entity';
import { FormVersion } from '../entities/form-version.entity';
import { from } from 'rxjs';

@Injectable()
export class FormRepository {
  constructor(
    @InjectRepository(Form)
    private readonly formRepo: Repository<Form>,

    @InjectRepository(FormSection)
    private readonly formSectionRepo: Repository<FormSection>,

    @InjectRepository(FormField)
    private readonly formFieldRepo: Repository<FormField>,

    @InjectRepository(FormVersion)
    private readonly formVersionRepo: Repository<FormVersion>
  ) {}

  // Función para mapear CreateFormDto a una entidad Form
  private async mapCreateFormDtoToEntity(dto: CreateFormDto): Promise<Form> {
    const form = this.formRepo.create({
      code: dto.code,
      name: dto.name,
      description: dto.description,
      tipo: dto.tipo,
      createdBy: dto.createdBy,
      settings: dto.settings,
      metadata: dto.metadata,
    });

    // Mapear las secciones y asociarlas al formulario
    if (Array.isArray(dto.sections)) {
      //const formSections = await this.mapSectionsDtoToEntities(dto.sections, form); // Aquí pasamos el objeto `form` completo
      //form.sections = formSections;
    } else {
      //form.sections = [];
      form.sections = dto.sections;
    }

    return form;
  }







  // Función para mapear FormSectionDto[] a FormSection[]
  private async mapSectionsDtoToEntities(sectionsDto: FormSection[], form: Form): Promise<FormSection[]> {
    return Promise.all(
      sectionsDto.map(async (sectionDto) => {
        // Primero, mapeamos los campos de la sección
        const fields = await this.mapFieldsDtoToEntities(sectionDto.fields);

        // Crear la entidad FormSection (con Partial<FormSection> en lugar de DeepPartial<FormSection>)
        const section = this.formSectionRepo.create(<Partial<FormSection>>{
          code: sectionDto.code,           // 'code' debe estar en la entidad
          title: sectionDto.title,         // 'title' debe estar en la entidad
          description: sectionDto.description,  // 'description' debe estar en la entidad
          orderIndex: sectionDto.orderIndex,  // 'orderIndex' debe estar en la entidad
          columns: sectionDto.columns ?? 1,   // 'columns' debe estar en la entidad (valor por defecto)
          isVisible: sectionDto.isVisible ?? true, // 'isVisible' debe estar en la entidad (valor por defecto)
          form: form,                       // Relacionamos esta sección con el formulario
          parentSection: sectionDto.parentSection ? await this.mapParentSectionDto(sectionDto.parentSection) : null,  // Relación recursiva con subsecciones
          subSections: sectionDto.subSections ? await this.mapSectionsDtoToEntities(sectionDto.subSections, form) : [],  // Relación con subsecciones
          formVersion: sectionDto.formVersion ? await this.mapFormVersionDto(sectionDto.formVersion) : null, // Relación con la versión del formulario
          fields: fields,                   // Relacionamos los campos con la sección
        });

        return section;
      })
    );
  }







  // Función para mapear los campos de FormFieldDto[] a FormField[]
  private async mapFieldsDtoToEntities(fieldsDto: FormField[]): Promise<FormField[]> {
    return fieldsDto.map((fieldDto) =>
      this.formFieldRepo.create({
        code: fieldDto.code,
        label: fieldDto.label,
        placeholder: fieldDto.placeholder,
        fieldType: fieldDto.fieldType,
        dataType: fieldDto.dataType,
        orderIndex: fieldDto.orderIndex,
        isRequired: fieldDto.isRequired,
        validationRules: fieldDto.validationRules,
        uiConfig: fieldDto.uiConfig,
        optionsConfig: fieldDto.optionsConfig,
      })
    );
  }

  // Función para mapear ParentSectionDto si es necesario
  private async mapParentSectionDto(parentSectionDto: FormSection): Promise<FormSection | null> {
    if (!parentSectionDto) return null;
    return this.formSectionRepo.findOne({ where: { id: parentSectionDto.id } }); // Encuentra la subsección por su ID
  }

  // Función para mapear FormVersionDto si es necesario
  private async mapFormVersionDto(formVersionDto: FormVersion): Promise<FormVersion | null> {
    if (!formVersionDto) return null;
    return this.formVersionRepo.findOne({ where: { id: formVersionDto.id } }); // Encuentra la versión por su ID
  }



  // Función para obtener todos los formularios con relaciones
  async findAll(): Promise<Form[]> {
    return await this.formRepo.find({
      relations: ['sections', 'businessRules', 'versions'],
    });
  }

  // Función para obtener un formulario por ID con relaciones
  async findById(id: string): Promise<Form | null> {
    return await this.formRepo.findOne({
      where: { id },
      relations: ['sections', 'businessRules', 'versions'],
    });
  }

  // Función para crear un formulario a partir de CreateFormDto
  async createForm(dto: CreateFormDto): Promise<Form> {
    let code = dto.code;
    
    // Verificar si ya existe un formulario con este código
    let existingForm = await this.formRepo.findOne({
      where: { code },
    });

    // Si existe, generar un nuevo código único
    let counter = 1;
    while (existingForm) {
      code = `${dto.code}_${counter}`;
      existingForm = await this.formRepo.findOne({
        where: { code },
      });
      counter++;
    }

    // Actualizar el DTO con el nuevo código único
    dto.code = code;

    const form = await this.mapCreateFormDtoToEntity(dto);
    return await this.formRepo.save(form);
  }


  // Función para actualizar un formulario a partir de UpdateFormDto
  async updateForm(id: string, dto: UpdateFormDto): Promise<Form | null> {
    const form = await this.findById(id);
    if (!form) {
      throw new Error('Form not found');
    }

    // Mapea el DTO de actualización a una entidad
    const updatedForm = await this.mapCreateFormDtoToEntity(dto as CreateFormDto);
    await this.formRepo.update({ id }, updatedForm);

    return this.findById(id); // Retorna el formulario actualizado
  }

  // Función para eliminar un formulario por ID
  async removeForm(id: string): Promise<void> {
    await this.formRepo.delete({ id });
  }
}
