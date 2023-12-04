import { Controller, Get } from '@nestjs/common';
import { TemplateService } from './template.service';

@Controller('template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Get()
  async getTemplateList() {
    return this.templateService.getTemplateList();
  }
}
