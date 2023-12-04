import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { TemplateStatus } from '../entity/template.entity';
import { CreateTemplateDto, CreateTemplateResponseDto } from './dto/create-template.dto';
import { TemplateStatusDto } from './dto/status.dto';
import { TemplateDto } from './dto/template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { TemplateService } from './template.service';

@Controller('template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Get()
  @ApiOperation({ summary: '설문지 리스트 조회' })
  @ApiQuery({ name: 'status', description: '설문지 상태', enum: TemplateStatus, required: false })
  @ApiResponse({ status: 200, type: [TemplateDto] })
  async getTemplateList(@Query('status') status?: TemplateStatus) {
    return this.templateService.getTemplateList(status);
  }

  @Post()
  @ApiOperation({ summary: '설문지 생성' })
  @ApiBody({ type: CreateTemplateDto })
  @ApiResponse({ status: 201, type: CreateTemplateResponseDto })
  async createTemplate(@Body() dto: CreateTemplateDto) {
    return this.templateService.createTemplate(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: '설문지 내용 수정' })
  @ApiBody({ type: UpdateTemplateDto })
  @ApiResponse({ status: 200, type: TemplateDto })
  async updateTemplate(@Param('id') id: number, @Body() dto: UpdateTemplateDto) {
    return this.templateService.updateTemplate(id, dto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: '설문지 상태 변경' })
  @ApiBody({ type: TemplateStatusDto })
  @ApiResponse({ status: 200, type: TemplateDto })
  async updateTemplateStatus(@Param('id') id: number, @Body() { status }: TemplateStatusDto) {
    return this.templateService.updateTemplateStatus(id, status);
  }

  @Delete(':id')
  @ApiOperation({ summary: '설문지 삭제' })
  @ApiResponse({ status: 200 })
  async deleteTemplate(@Param('id') id: number) {
    return this.templateService.deleteTemplate(id);
  }
}
