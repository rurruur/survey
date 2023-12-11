import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class AnswerInput {
  @Field(() => Int)
  questionNumber: number;

  @Field(() => String)
  content: string;
}
