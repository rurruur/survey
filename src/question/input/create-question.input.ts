import { Field, InputType, Int } from '@nestjs/graphql';
import { OptionInput } from './option.input';

@InputType()
export class CreateQuestionInput {
  @Field(() => Int)
  templateId: number;

  @Field(() => String)
  content: string;

  @Field(() => [OptionInput])
  options: OptionInput[];
}
