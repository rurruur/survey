import { Field, InputType, Int } from '@nestjs/graphql';
import { AnswerInput } from './answer.input';

@InputType()
export class CreateRespondInput {
  @Field(() => Int)
  templateId: number;

  @Field(() => [AnswerInput])
  answers: AnswerInput[];
}
