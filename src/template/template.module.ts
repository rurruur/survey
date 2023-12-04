import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Template } from '../entity/template.entity';
import { TemplateResolver } from './template.resolver';
import { TemplateService } from './template.service';

@Module({
  imports: [TypeOrmModule.forFeature([Template])],
  providers: [TemplateService, TemplateResolver],
})
export class TemplateModule {}
