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
  async createQuestion(@Args('input') { templateId, content, answers }: CreateQuestionInput) {
    return this.questionService.createQuestion(templateId, content, answers);
  }

  @Mutation(() => Question)
  async updateQuestion(@Args('input') { templateId, questionNumber, content, answers }: UpdateQuestionInput) {
    return this.questionService.updateQuestion(templateId, questionNumber, content, answers);
  }

  @Mutation(() => Boolean)
  async deleteQuestion(@Args('templateId') templateId: number, @Args('questionNumber') questionNumber: number) {
    return this.questionService.deleteQuestion(templateId, questionNumber);
  }
}
