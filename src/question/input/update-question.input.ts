import { Field, InputType, Int } from '@nestjs/graphql';
import { OptionInput } from './option.input';

@InputType()
export class UpdateQuestionInput {
  @Field(() => Int)
  templateId: number;

  @Field(() => Int)
  questionNumber: number;

  @Field(() => String, { nullable: true })
  content?: string;

  @Field(() => [OptionInput], { nullable: true })
  options?: OptionInput[];
}
