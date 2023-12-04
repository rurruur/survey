import { Field, InputType } from '@nestjs/graphql';
import { Length } from 'class-validator';

@InputType()
export class CreateTemplateInput {
  @Field(() => String)
  @Length(1, 255)
  title: string;

  @Field(() => String, { nullable: true })
  description?: string;
}
