import { ApiProperty } from '@nestjs/swagger';
import { TemplateStatus } from '../../entity/template.entity';

export class TemplateDto {
  @ApiProperty({ description: '설문지 아이디' })
  id: number;

  @ApiProperty({ description: '설문지 제목' })
  title: string;

  @ApiProperty({ description: '설문지 설명' })
  description: string;

  @ApiProperty({ description: '설문지 상태', enum: TemplateStatus })
  status: TemplateStatus;

  @ApiProperty({ description: '생성일자' })
  createdAt: Date;

  @ApiProperty({ description: '갱신일자' })
  updatedAt: Date;
}
