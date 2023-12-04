import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Template, TemplateStatus } from '../entity/template.entity';
import { CreateTemplateDto } from './dto/create-template.dto';

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
}
