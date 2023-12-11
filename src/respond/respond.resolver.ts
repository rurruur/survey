import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Respond } from '../entity/respond.entity';
import { CreateRespondInput } from './input/create-respond.input';
import { UpdateRespondInput } from './input/update-respond.input';
import { RespondService } from './respond.service';

@Resolver(() => Respond)
export class RespondResolver {
  constructor(private readonly respondService: RespondService) {}

  @Query(() => [Respond])
  async respondList(@Args('templateId') templateId: number) {
    return this.respondService.getRespondList(templateId);
  }

  @Mutation(() => Respond)
  async createRespond(@Args('input') { templateId, answers }: CreateRespondInput) {
    return this.respondService.createRespond(templateId, answers);
  }

  @Mutation(() => Respond)
  async updateRespond(@Args('input') { respondId, answers }: UpdateRespondInput) {
    return this.respondService.updateRespond(respondId, answers);
  }

  @Mutation(() => Respond)
  async submitRespond(@Args('respondId') respondId: number) {
    return this.respondService.submitRespond(respondId);
  }

  @Mutation(() => Boolean)
  async deleteRespond(@Args('respondId') respondId: number) {
    return this.respondService.deleteRespond(respondId);
  }
}
