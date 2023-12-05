import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class AnswerInput {
  @Field(() => String)
  content: string;

  @Field(() => Int)
  score: number;
}
