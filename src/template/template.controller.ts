import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { TemplateStatus } from '../entity/template.entity';
import { CreateTemplateDto, CreateTemplateResponseDto } from './dto/create-template.dto';
import { TemplateDto } from './dto/template.dto';
import { TemplateService } from './template.service';

@Controller('template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Get()
  @ApiOperation({ description: '설문지 리스트 조회' })
  @ApiQuery({ name: 'status', description: '설문지 상태', enum: TemplateStatus, required: false })
  @ApiResponse({ status: 200, type: [TemplateDto] })
  async getTemplateList(@Query('status') status?: TemplateStatus) {
    return this.templateService.getTemplateList(status);
  }

  @Post()
  @ApiOperation({ description: '설문지 생성' })
  @ApiBody({ type: CreateTemplateDto })
  @ApiResponse({ status: 201, type: CreateTemplateResponseDto })
  async createTemplate(@Body() dto: CreateTemplateDto) {
    return this.templateService.createTemplate(dto);
  }
}
