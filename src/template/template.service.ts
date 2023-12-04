import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { Repository } from 'typeorm';
import { Template, TemplateStatus } from '../entity/template.entity';
import { CreateTemplateInput } from './input/create-template.input';
import { UpdateTemplateInput } from './input/update-template.input';

@Injectable()
export class TemplateService {
  private readonly logger = new Logger(TemplateService.name);
  constructor(@InjectRepository(Template) private readonly templateRepository: Repository<Template>) {}

  async getTemplateList(status?: TemplateStatus) {
    const templates = await this.templateRepository.find({ where: { status } });

    return templates;
  }

  async createTemplate({ title, description }: CreateTemplateInput) {
    const template = this.templateRepository.create({ title, description });

    const { identifiers } = await this.templateRepository.insert(template);
    this.logger.log(`설문지 생성: ${JSON.stringify(template)}`);

    return this.templateRepository.findOneBy({ id: identifiers[0].id });
  }

  async updateTemplate({ id, title, description }: UpdateTemplateInput) {
    const template = await this.templateRepository.findOneBy({ id });

    if (!template) {
      throw new BadRequestException('설문지가 존재하지 않습니다.');
    }
    if (template.status !== TemplateStatus.WAITING) {
      throw new BadRequestException('대기중 상태의 설문지만 수정할 수 있습니다.');
    }

    const updatedTemplate = await this.templateRepository.save({ ...template, title, description });
    this.logger.log(`설문지 수정: ${JSON.stringify(updatedTemplate)}`);

    return updatedTemplate;
  }

  async updateTemplateStatus(id: number, status: TemplateStatus) {
    const template = await this.templateRepository.findOneBy({ id });

    if (!template) {
      throw new BadRequestException('설문지가 존재하지 않습니다.');
    } else if (template.status === TemplateStatus.COMPLETED) {
      throw new BadRequestException('완료된 설문지는 상태를 변경할 수 없습니다.');
    } else if (status === TemplateStatus.WAITING && template.status === TemplateStatus.IN_PROGRESS) {
      throw new BadRequestException('진행중인 설문지는 대기중으로 변경할 수 없습니다.');
    }

    const updatedTemplate = await this.templateRepository.save({ ...template, status });
    this.logger.log(`설문지(id: ${id}) 상태 변경: ${template.status} -> ${status}`);

    return updatedTemplate;
  }

  async deleteTemplate(id: number) {
    const template = await this.templateRepository.findOneBy({ id });

    if (!template) {
      throw new BadRequestException('설문지가 존재하지 않습니다.');
    } else if (template.status !== TemplateStatus.WAITING) {
      throw new BadRequestException('대기중 상태의 설문지만 삭제할 수 있습니다.');
    } else if (template.deletedAt) {
      throw new BadRequestException('이미 삭제된 설문지입니다.');
    }

    await this.templateRepository.save({ ...template, deletedAt: dayjs() });
    this.logger.log(`설문지(id: ${id}) 삭제`);

    return true;
  }
}
