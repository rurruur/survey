import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateTemplateDto {
  @ApiProperty({ description: '설문지 제목', maxLength: 255, required: false })
  @IsOptional()
  @Length(1, 255)
  title: string;

  @ApiProperty({ description: '설문지 설명', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
