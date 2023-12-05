import { Field, InputType, Int } from '@nestjs/graphql';
import { AnswerInput } from './answer.input';

@InputType()
export class CreateQuestionInput {
  @Field(() => Int)
  templateId: number;

  @Field(() => String)
  content: string;

  @Field(() => [AnswerInput])
  answers: AnswerInput[];
}
