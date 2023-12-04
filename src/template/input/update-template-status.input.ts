import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { TemplateStatus } from '../../entity/template.entity';

@InputType()
export class UpdateTemplateStatusInput {
  @Field(() => Int)
  id: number;

  @Field(() => TemplateStatus)
  @IsEnum(TemplateStatus)
  status: TemplateStatus;
}
