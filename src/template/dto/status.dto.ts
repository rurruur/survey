import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { TemplateStatus } from '../../entity/template.entity';

export class TemplateStatusDto {
  @ApiProperty({ description: '설문지 상태', enum: TemplateStatus })
  @IsEnum(TemplateStatus)
  status: TemplateStatus;
}
