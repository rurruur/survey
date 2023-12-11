import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Respond } from '../entity/respond.entity';
import { CreateRespondInput } from './input/create-respond.input';
import { UpdateRespondInput } from './input/update-respond.input';
import { RespondService } from './respond.service';

// - 답변을 한 사용자의 정보는 저장하지 않는다.
// - 작성 중 백업을 위해 `Respond.isSubmitted`를 이용한다.

// - 진행중 상태의 설문지만 답변 생성이 가능하다.
// - 설문지ID를 이용하여 해당 설문지에 생성된 답변 리스트를 조회할 수 있다.
// - 제출 이후 답변 수정은 불가능하다.
//   - 작성중인 답변이라도 설문지가 완료된 경우 제출이 불가능하다.
// - 설문지가 완료되었더라도 삭제를 가능하게 할 것인지?

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
