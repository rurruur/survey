import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class AnswerInput {
  @Field(() => Int)
  questionNumber: number;

  @Field(() => String)
  content: string;
}

@InputType()
export class CreateRespondInput {
  @Field(() => Int)
  templateId: number;

  @Field(() => [AnswerInput])
  answers: AnswerInput[];
}
