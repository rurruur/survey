import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class OptionInput {
  @Field(() => String)
  content: string;

  @Field(() => Int)
  score: number;
}
