import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Form } from '../entities/form.entity';
import { CreateFormDto, UpdateFormDto } from '../dtos';
import { FormSectionDto, FormFieldDto } from '../dtos/create-form.dto';
import { FormSection } from '../entities/form-section.entity';
import { FormField } from '../entities/form-field.entity';
import { FormVersion } from '../entities/form-version.entity';
import { from } from 'rxjs';
import { User } from '../entities';

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
      form.sections = await this.mapSectionsDtoToEntities(dto.sections, form);
    } else {
      form.sections = [];
    }

    await this.formRepo.save(form);

    return form;
  }

  // Función para mapear FormSectionDto[] a FormSection[]
  private async mapSectionsDtoToEntities(
    sectionsDto: FormSectionDto[],
    form: Form
  ): Promise<FormSection[]> {
    return Promise.all(
      sectionsDto.map(async (sectionDto) => {
        // Mapear parentSection si existe
        let parentSection: FormSection | null = null;
        if (sectionDto.parentSection && sectionDto.parentSection.id) {
          parentSection = await this.formSectionRepo.findOne({
            where: { id: sectionDto.parentSection.id },
          });
        }

        // Mapear formVersion si existe
        let formVersion: FormVersion | null = null;
        if (sectionDto.formVersion) {
          formVersion = await this.formVersionRepo.findOne({
            where: { id: sectionDto.formVersion },
          });
        }

        // Crear la entidad FormSection
        const section = this.formSectionRepo.create({
          code: sectionDto.code,
          title: sectionDto.title,
          description: sectionDto.description ?? null,
          orderIndex: sectionDto.orderIndex ?? 0,
          columns: sectionDto.columns ?? 1,
          isVisible: sectionDto.isVisible ?? true,
          form: form,
          parentSection: parentSection ?? null,
          subSections: sectionDto.subSections
            ? await this.mapSectionsDtoToEntities(sectionDto.subSections, form)
            : [],
          formVersion: formVersion ?? undefined,
        } as Partial<FormSection>);

        
        //section.form = form;
        //section.id = form.id;
        await this.formSectionRepo.insert(section);

        // Mapear los campos asociando la sección
        section.fields = await this.mapFieldsDtoToEntities(sectionDto.fields ?? [], section);

        return section;
      })
    );
  }

  // Función auxiliar para mapear campos
 /*private async mapFieldsDtoToEntities(
    fieldsDto: FormFieldDto[],
    section: FormSection
  ): Promise<FormField[]> {
    return fieldsDto.map((fieldDto) =>
      this.formFieldRepo.create({
        code: fieldDto.code,
        label: fieldDto.label,
        placeholder: fieldDto.placeholder ?? null,
        fieldType: fieldDto.fieldType ?? null,
        dataType: fieldDto.dataType ?? null,
        orderIndex: fieldDto.orderIndex ?? 0,
        isRequired: fieldDto.isRequired ?? false,
        validationRules: fieldDto.validationRules ?? {},
        uiConfig: fieldDto.uiConfig ?? {},
        optionsConfig: fieldDto.optionsConfig ?? {},
        section: section, //  Asociar sección padre
      } as Partial<FormField>)
    );
  }*/
  // Función auxiliar para mapear campos
  private async mapFieldsDtoToEntities(
    fieldsDto: FormFieldDto[],
    section: FormSection
  ): Promise<FormField[]> {
    // Aquí es donde mapeas los campos a entidades
    return Promise.all(fieldsDto.map(async (fieldDto) => {
      const field = this.formFieldRepo.create({
        code: fieldDto.code,
        label: fieldDto.label,
        placeholder: fieldDto.placeholder ?? null,
        fieldType: fieldDto.fieldType ?? null,
        dataType: fieldDto.dataType ?? null,
        orderIndex: fieldDto.orderIndex ?? 0,
        isRequired: fieldDto.isRequired ?? false,
        validationRules: fieldDto.validationRules ?? {},
        uiConfig: fieldDto.uiConfig ?? {},
        optionsConfig: fieldDto.optionsConfig ?? {},
        section: section, // Aquí asociamos la sección al campo
      } as Partial<FormField>);

      // **Lo importante**: guardamos cada campo en la base de datos
      await this.formFieldRepo.save(field);  // Cambié este punto

      return field;
    }));
  }

  // Función para crear una nueva versión del formulario
  // Función para crear una nueva versión del formulario
  private async createFormVersion(form: Form): Promise<FormVersion> {
    const formVersion = new FormVersion();

    // Asignamos los valores a la versión
    formVersion.versionNumber = 1;  // Primera versión
    formVersion.changelog = "Creación inicial del formulario";  // Aquí puedes agregar un changelog descriptivo
    formVersion.isCurrent = true;  // Esta es la versión actual
    formVersion.form = form;  // Asociamos el formulario
    formVersion.createdAt = new Date();  // Fecha de creación
    formVersion.schemaSnapshot = {};  // Snapshot del esquema (ajusta según necesidad)

    // Guardamos la versión en la base de datos
    await this.formVersionRepo.save(formVersion);

    return formVersion;
  }




  // Función para mapear ParentSectionDto si es necesario
  private async mapParentSectionDto(parentSectionDto: FormSection): Promise<FormSection | null> {
    if (!parentSectionDto) return null;
    return this.formSectionRepo.findOne({ where: { id: parentSectionDto.id } }); // Encuentra la subsección por su ID
  }

  // Función para mapear FormVersionDto si es necesario
  private async mapFormVersionDto(formVersionId: string): Promise<FormVersion | undefined> {
    if (!formVersionId) return undefined;
    return await this.formVersionRepo.findOne({ where: { id: formVersionId } }) || undefined;
  }




  // Función para obtener todos los formularios con relaciones
  /*async findAll(): Promise<Form[]> {
    return await this.formRepo.find({
      relations: ['sections', 'sections.fields', 'businessRules', 'versions'],
    });
  }*/
  async findAll(page: number = 1, limit: number = 10): Promise<{ data: Form[]; total: number; page: number; lastPage: number }> {
    const [data, total] = await this.formRepo.findAndCount({
      relations: ['sections', 'sections.fields', 'businessRules', 'versions'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' }, 
      
    });

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }



  // Función para obtener un formulario por ID con relaciones
  /*async findById(id: string): Promise<Form | null> {
    return await this.formRepo.findOne({
      where: { id },
      relations: ['sections', 'businessRules', 'versions'],
    });
  }*/
 // Función para obtener un formulario por ID con relaciones
  async findById(id: string): Promise<Form | null> {
    return await this.formRepo.findOne({
      where: { id },
      relations: ['sections', 'sections.fields', 'businessRules', 'versions'], 
    });
  }


  // Función para crear un formulario a partir de CreateFormDto
  /*async createForm(dto: CreateFormDto): Promise<Form> {
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
  }*/
  // Función para crear un formulario a partir de CreateFormDto
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

    // Crear el formulario sin el campo 'createdBy'
    const form = await this.mapCreateFormDtoToEntity(dto);

    // **Crear la versión por defecto** y asociarla al formulario
    const formVersion = await this.createFormVersion(form);

    // Asocia la versión creada al formulario
    form.versions = [formVersion];  // Asociamos la versión al formulario

    // Guardamos el formulario con la versión
    await this.formRepo.save(form);

    return form;
  }




  // Función para actualizar un formulario a partir de UpdateFormDto
  /*async updateForm(id: string, dto: UpdateFormDto): Promise<Form | null> {
    const form = await this.findById(id);
    if (!form) {
      throw new Error('Form not found');
    }

    // Mapea el DTO de actualización a una entidad
    const updatedForm = await this.mapCreateFormDtoToEntity(dto as CreateFormDto);
    await this.formRepo.update({ id }, updatedForm);

    return this.findById(id); // Retorna el formulario actualizado
  }*/
 // Función para actualizar un formulario a partir de UpdateFormDto
  // Función para actualizar un formulario a partir de UpdateFormDto
  async updateForm(id: string, dto: UpdateFormDto): Promise<Form | null> {
    try {
      const form = await this.findById(id);
      if (!form) {
        throw new NotFoundException(`Formulario con ID ${id} no encontrado`);
      }

      const partialForm = dto as unknown as DeepPartial<Form>;
      this.formRepo.merge(form, partialForm);
      await this.formRepo.save(form);

      return this.findById(id);
    } catch (error) {
      console.error('Error en updateForm:', error);
      throw new InternalServerErrorException(error.message);
    }
  }





  // Función para eliminar un formulario por ID
  async removeForm(id: string): Promise<void> {
    const form = await this.formRepo.findOne({ where: { id } });

    if (!form) {
      throw new Error(`Formulario con ID ${id} no encontrado`);
    }

    await this.formRepo.remove(form);
  }

}
