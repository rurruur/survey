import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Template, TemplateStatus } from '../entity/template.entity';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';

@Injectable()
export class TemplateService {
  private readonly logger = new Logger(TemplateService.name);
  constructor(@InjectRepository(Template) private readonly templateRepository: Repository<Template>) {}

  async getTemplateList(status?: TemplateStatus) {
    const templates = await this.templateRepository.find({ where: { status } });

    return templates;
  }

  async createTemplate(dto: CreateTemplateDto) {
    const template = this.templateRepository.create(dto);

    await this.templateRepository.save(template);
    this.logger.log(`설문지 생성: ${JSON.stringify(template)}`);

    return template;
  }

  async updateTemplate(id: number, dto: UpdateTemplateDto) {
    const template = await this.templateRepository.findOneBy({ id });

    if (!template) {
      throw new BadRequestException('설문지가 존재하지 않습니다.');
    }
    if (template.status !== TemplateStatus.WAITING) {
      throw new BadRequestException('대기중 상태의 설문지만 수정할 수 있습니다.');
    }

    const updatedTemplate = await this.templateRepository.save({ ...template, ...dto });
    this.logger.log(`설문지 수정: ${JSON.stringify(updatedTemplate)}`);

    return updatedTemplate;
  }
}
