import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Template, TemplateStatus } from '../entity/template.entity';
import { CreateTemplateInput } from './input/create-template.input';
import { UpdateTemplateStatusInput } from './input/update-template-status.input';
import { UpdateTemplateInput } from './input/update-template.input';
import { TemplateService } from './template.service';

@Resolver(() => Template)
export class TemplateResolver {
  constructor(private readonly templateService: TemplateService) {}

  @Query(() => [Template])
  async templateList(@Args('status', { nullable: true }) status?: TemplateStatus) {
    return this.templateService.getTemplateList(status);
  }

  @Mutation(() => Template)
  async createTemplate(@Args('input') createTemplateInput: CreateTemplateInput) {
    return this.templateService.createTemplate(createTemplateInput);
  }

  @Mutation(() => Template)
  async updateTemplate(@Args('input') input: UpdateTemplateInput) {
    return this.templateService.updateTemplate(input);
  }

  @Mutation(() => Template)
  async updateTemplateStatus(@Args('input') { id, status }: UpdateTemplateStatusInput) {
    return this.templateService.updateTemplateStatus(id, status);
  }

  @Mutation(() => Boolean)
  async deleteTemplate(@Args('id') id: number) {
    return this.templateService.deleteTemplate(id);
  }
}
