import { Field, InputType, Int } from '@nestjs/graphql';
import { AnswerInput } from './answer.input';

@InputType()
export class UpdateRespondInput {
  @Field(() => Int)
  respondId: number;

  @Field(() => [AnswerInput])
  answers: AnswerInput[];
}
