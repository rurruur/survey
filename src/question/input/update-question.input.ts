import { Field, InputType, Int } from '@nestjs/graphql';
import { AnswerInput } from './answer.input';

@InputType()
export class UpdateQuestionInput {
  @Field(() => Int)
  templateId: number;

  @Field(() => Int)
  questionNumber: number;

  @Field(() => String, { nullable: true })
  content?: string;

  @Field(() => [AnswerInput], { nullable: true })
  answers?: AnswerInput[];
}
