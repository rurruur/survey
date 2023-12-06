import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Template, TemplateStatus } from '../entity/template.entity';
import { CreateTemplateInput } from './input/create-template.input';
import { UpdateTemplateInput } from './input/update-template.input';

@Injectable()
export class TemplateService {
  private readonly logger = new Logger(TemplateService.name);
  constructor(@InjectRepository(Template) private readonly templateRepository: Repository<Template>) {}

  async getTemplateList(status?: TemplateStatus) {
    const templates = await this.templateRepository.find({ where: { status } });

    return templates;
  }

  async createTemplate({ title, description }: CreateTemplateInput) {
    const template = this.templateRepository.create({ title, description });
    const { identifiers } = await this.templateRepository.insert(template);
    this.logger.log(`설문지 생성: ${JSON.stringify(template)}`);

    return this.templateRepository.findOneBy({ id: identifiers[0].id });
  }

  /** 대기중인 설문지만 수정 가능 */
  async updateTemplate({ id, title, description }: UpdateTemplateInput) {
    const template = await this.templateRepository.findOneBy({ id });
    if (!template) {
      throw new BadRequestException('설문지가 존재하지 않습니다.');
    }

    const { isEditable, reason } = template.isEditable();
    if (isEditable === false) {
      throw new BadRequestException(reason);
    }

    Object.assign(template, { ...(title && { title }), ...(description && { description }) });

    await this.templateRepository.update({ id }, template);
    this.logger.log(`설문지 수정: ${JSON.stringify(template)}`);

    return template;
  }

  /**
   * 가능한 상태변경
   * - 대기중 -> 진행중: 질문이 1개 이상
   * - 진행중 -> 완료
   */
  async updateTemplateStatus(id: number, nextStatus: TemplateStatus) {
    const [template] = await this.templateRepository.find({ relations: ['questions'], where: { id } });
    if (!template) {
      throw new BadRequestException('설문지가 존재하지 않습니다.');
    }
    if (template.deletedAt) {
      throw new BadRequestException('삭제된 설문지는 상태를 변경할 수 없습니다.');
    }
    if (template.completed) {
      throw new BadRequestException('완료된 설문지는 상태를 변경할 수 없습니다.');
    }
    if (template.waiting && nextStatus === TemplateStatus.COMPLETED) {
      throw new BadRequestException('대기중인 설문지는 완료로 변경할 수 없습니다.');
    }
    if (template.inProgress && nextStatus === TemplateStatus.WAITING) {
      throw new BadRequestException('진행중인 설문지는 대기중으로 변경할 수 없습니다.');
    }
    if (!template.questions?.length && nextStatus === TemplateStatus.IN_PROGRESS) {
      throw new BadRequestException('설문지에 질문이 없습니다.');
    }

    Object.assign(template, { status: nextStatus, questions: undefined });
    await this.templateRepository.update({ id }, template);
    this.logger.log(`설문지(id: ${id}) 상태 변경: ${template.status} -> ${nextStatus}`);

    return template;
  }

  /** 대기중인 설문지만 삭제 가능 */
  async deleteTemplate(id: number) {
    const template = await this.templateRepository.findOneBy({ id });
    if (!template) {
      throw new BadRequestException('설문지가 존재하지 않습니다.');
    }

    const { isEditable, reason } = template.isEditable();
    if (isEditable === false) {
      throw new BadRequestException(reason);
    }

    await this.templateRepository.softDelete({ id });
    this.logger.log(`설문지(id: ${id}) 삭제`);

    return true;
  }
}
