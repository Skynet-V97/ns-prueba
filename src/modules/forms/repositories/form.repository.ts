import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Form } from '../entities/form.entity';
import { CreateFormDto, UpdateFormDto } from '../dtos';
import { FormSectionDto, FormFieldDto } from '../dtos/create-form.dto';
import { FormSection } from '../entities/form-section.entity';
import { FormField } from '../entities/form-field.entity';
import { FormVersion } from '../entities/form-version.entity';
import { User, ValidationRule } from '../entities';
import { QueryRunner } from 'typeorm';

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
    private readonly formVersionRepo: Repository<FormVersion>, 

    ////////////////////////////////////////////////////////
    @InjectRepository(ValidationRule)
    private readonly validationRuleRepo: Repository<ValidationRule>
  ) {}

  // Función para mapear CreateFormDto a una entidad Form
  private async mapCreateFormDtoToEntity(dto: CreateFormDto, queryRunner: QueryRunner): Promise<Form> {
    const form = this.formRepo.create({
      code: dto.code,
      name: dto.name,
      description: dto.description,
      tipo: dto.tipo,
      createdBy: dto.createdBy,
      settings: dto.settings,
      metadata: dto.metadata,
    });

    await queryRunner.manager.save(form);  // Guardar el formulario dentro de la transacción

    // Mapear las secciones y asociarlas al formulario
    if (Array.isArray(dto.sections)) {
      form.sections = await this.mapSectionsDtoToEntities(dto.sections, form, queryRunner);
    } else {
      form.sections = [];
    }

    //await queryRunner.manager.save(form);  // Guardar el formulario dentro de la transacción
    await queryRunner.manager.save(form);

    return form;
  }

  // Función para mapear FormSectionDto[] a FormSection[]
  private async mapSectionsDtoToEntities(
    sectionsDto: FormSectionDto[],
    form: Form,
    queryRunner: QueryRunner
  ): Promise<FormSection[]> {
    return Promise.all(
      sectionsDto.map(async (sectionDto) => {
        let parentSection: FormSection | null = null;
        if (sectionDto.parentSection && sectionDto.parentSection.id) {
          parentSection = await this.formSectionRepo.findOne({
            where: { id: sectionDto.parentSection.id },
          });
        }

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
            ? await this.mapSectionsDtoToEntities(sectionDto.subSections, form, queryRunner)
            : [],
          formVersion: formVersion ?? undefined,
        } as Partial<FormSection>);

        // Insertar la sección usando el queryRunner para la transacción
        await queryRunner.manager.save(section);

        // Mapear los campos asociados a esta sección
        section.fields = await this.mapFieldsDtoToEntities(sectionDto.fields ?? [], section, queryRunner);

        return section;
      })
    );
  }

  // Función auxiliar para mapear campos
  private async mapFieldsDtoToEntities(
    fieldsDto: FormFieldDto[],
    section: FormSection,
    queryRunner: QueryRunner
  ): Promise<FormField[]> {
    return Promise.all(fieldsDto.map(async (fieldDto) => {
      const field = this.formFieldRepo.create({
        code: fieldDto.code,
        label: fieldDto.label,
        placeholder: fieldDto.placeholder ?? null,
        fieldType: fieldDto.fieldType ?? null,
        dataType: fieldDto.dataType ?? null,
        orderIndex: fieldDto.orderIndex ?? 0,
        isRequired: fieldDto.isRequired ?? false,
        //validationRules: fieldDto.validationRules ?? {},
        validationRules: [], // se llenará abajo
        uiConfig: fieldDto.uiConfig ?? {},
        optionsConfig: fieldDto.optionsConfig ?? {},
        section: section,
      } as Partial<FormField>);

      // Guardar el campo dentro de la transacción
      await queryRunner.manager.save(field);

      // ---Crear las validaciones asociadas ---
      if (fieldDto.validationRules && typeof fieldDto.validationRules === 'object') {
        const validationEntries = Object.entries(fieldDto.validationRules);

        const rules: ValidationRule[] = validationEntries
          .filter(([key]) => key !== 'errorMessage') // omitimos errorMessage para usarlo como parámetro
          .map(([key, value]) => {
            const rule = this.validationRuleRepo.create({
              name: key, // ejemplo: required, pattern, minLength
              expression: typeof value === 'string' ? value : String(value),
              parameters: {
                errorMessage: fieldDto.validationRules?.errorMessage ?? null,
              },
              field,
            });
            return rule;
          });

        await queryRunner.manager.save(rules);
        field.validationRules = rules;
      }

      return field;
    }));
  }

  // Función para crear un formulario
  async createForm(dto: CreateFormDto): Promise<Form> {
    const queryRunner = this.formRepo.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      let code = dto.code;
      let existingForm = await this.formRepo.findOne({ where: { code } });

      let counter = 1;
      while (existingForm) {
        code = `${dto.code}_${counter}`;
        existingForm = await this.formRepo.findOne({ where: { code } });
        counter++;
      }
      dto.code = code;

      // Crear el formulario (y sus secciones) — ya guarda en la BD dentro del método
      const form = await this.mapCreateFormDtoToEntity(dto, queryRunner);

      // Asegurarse que el form tiene un ID (persistido)
      if (!form.id) {
        await queryRunner.manager.save(form);
      }

      // Crear la versión, usando el mismo queryRunner
      const formVersion = await this.createFormVersion(form, queryRunner);

      form.versions = [formVersion];

      // Guardar nuevamente el formulario con la relación a su versión
      await queryRunner.manager.save(form);

      await queryRunner.commitTransaction();
      return form;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }


  // Función para crear una versión de un formulario
  private async createFormVersion(form: Form, queryRunner: QueryRunner): Promise<FormVersion> {
    const formVersion = new FormVersion();
    formVersion.versionNumber = 1;
    formVersion.changelog = "Creación inicial del formulario";
    formVersion.isCurrent = true;
    formVersion.form = form;
    formVersion.createdAt = new Date();
    formVersion.schemaSnapshot = {};

    await queryRunner.manager.save(formVersion);
    return formVersion;
  }



  // src/modules/forms/repositories/form.repository.ts
  async findAll(page: number = 1, limit: number = 10) {
    const [data, total] = await this.formRepo.findAndCount({
      relations: ['sections', 'sections.fields', 'businessRules', 'versions', 'sections.fields.validationRules'],
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

  // src/modules/forms/repositories/form.repository.ts
  async findById(id: string) {
    return await this.formRepo.findOne({
      where: { id },
      relations: ['sections', 'sections.fields', 'businessRules', 'versions', 'sections.fields.validationRules'],
    });
  }

  // src/modules/forms/repositories/form.repository.ts
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

  //Eliinacion fisica con cascada usando solo QueryRunner
  /*async removeForm(id: string): Promise<void> {
    const queryRunner = this.formRepo.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      // Borrar reglas de validación directamente por subconsulta
      await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(ValidationRule)
        .where(`"fieldId" IN (SELECT id FROM form_fields WHERE "sectionId" IN (SELECT id FROM form_sections WHERE "formId" = :id))`, { id })
        .execute();

      // Borrar campos
      await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(FormField)
        .where(`"sectionId" IN (SELECT id FROM form_sections WHERE "formId" = :id)`, { id })
        .execute();

      // Borrar secciones
      await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(FormSection)
        .where('"formId" = :id', { id })
        .execute();

      // Borrar formulario
      await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(Form)
        .where('"id" = :id', { id })
        .execute();

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(`Error al eliminar el formulario: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }*/

  // Eliminación lógica con cascada usando solo QueryRunner
  async removeForm(id: string): Promise<void> {
    const queryRunner = this.formRepo.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      // Inactivar campos
      await queryRunner.manager
        .createQueryBuilder()
        .update(FormField)
        .set({ isActive: false })
        .where(`"sectionId" IN (
          SELECT id FROM form_sections WHERE "formId" = :id
        )`, { id })
        .execute();

      // Inactivar secciones
      await queryRunner.manager
        .createQueryBuilder()
        .update(FormSection)
        .set({ isActive: false })
        .where(`"formId" = :id`, { id })
        .execute();

      // Inactivar versiones del formulario
      await queryRunner.manager
        .createQueryBuilder()
        .update(FormVersion)
        .set({ isActive: false })
        .where(`"formId" = :id`, { id })
        .execute();

      // Inactivar formulario principal
      await queryRunner.manager
        .createQueryBuilder()
        .update(Form)
        .set({ isActive: false })
        .where(`"id" = :id`, { id })
        .execute();

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(`Error al desactivar el formulario: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }








}
