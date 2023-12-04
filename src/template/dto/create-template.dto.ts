import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class CreateTemplateDto {
  @ApiProperty({ description: '설문지 제목', maxLength: 255 })
  @Length(1, 255)
  title: string;

  @ApiProperty({ description: '설문지 설명', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}

export class CreateTemplateResponseDto {
  @ApiProperty({ description: '설문지 아이디' })
  id: number;

  @ApiProperty({ description: '설문지 제목' })
  title: string;

  @ApiProperty({ description: '설문지 설명', required: false })
  description?: string;
}
