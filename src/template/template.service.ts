import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Template } from '../entity/template.entity';

@Injectable()
export class TemplateService {
  constructor(@InjectRepository(Template) private readonly templateRepository: Repository<Template>) {}

  async getTemplateList() {
    const templates = await this.templateRepository.find();

    return templates;
  }
}
