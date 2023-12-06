import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Question } from '../entity/question.entity';
import { CreateQuestionInput } from './input/create-question.input';
import { UpdateQuestionInput } from './input/update-question.input';
import { QuestionService } from './question.service';

@Resolver(() => Question)
export class QuestionResolver {
  constructor(private readonly questionService: QuestionService) {}

  @Query(() => [Question])
  async questionList(@Args('templateId') templateId: number) {
    return this.questionService.getQuestionList(templateId);
  }

  @Mutation(() => Question)
  async createQuestion(@Args('input') { templateId, content, options }: CreateQuestionInput) {
    return this.questionService.createQuestion(templateId, content, options);
  }

  @Mutation(() => Question)
  async updateQuestion(@Args('input') { templateId, questionNumber, content, options }: UpdateQuestionInput) {
    return this.questionService.updateQuestion(templateId, questionNumber, content, options);
  }

  @Mutation(() => Boolean)
  async deleteQuestion(@Args('templateId') templateId: number, @Args('questionNumber') questionNumber: number) {
    return this.questionService.deleteQuestion(templateId, questionNumber);
  }
}
