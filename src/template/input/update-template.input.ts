import { Field, InputType, Int } from '@nestjs/graphql';
import { Length } from 'class-validator';

@InputType()
export class UpdateTemplateInput {
  @Field(() => Int)
  id: number;

  @Field(() => String, { nullable: true })
  @Length(1, 255)
  title?: string;

  @Field(() => String, { nullable: true })
  description?: string;
}
