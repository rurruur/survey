import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Respond } from '../entity/respond.entity';
import { Template } from '../entity/template.entity';
import { AnswerInput } from './input/create-respond.input';

@Injectable()
export class RespondService {
  constructor(
    @InjectRepository(Respond) private readonly respondRepository: Repository<Respond>,
    @InjectRepository(Template) private readonly templateRepository: Repository<Template>,
  ) {}

  /** 설문지에 해당하는 답변 리스트를 최근 업데이트된 순서로 조회 */
  async getRespondList(templateId: number) {
    const template = await this.templateRepository.findOneBy({ id: templateId });
    if (!template) {
      throw new BadRequestException('설문지가 존재하지 않습니다.');
    }
    if (template.waiting) {
      throw new BadRequestException('아직 진행되지 않은 설문지입니다.');
    }

    const responds = await this.respondRepository.find({
      where: { templateId },
      order: { updatedAt: 'DESC' },
    });

    return responds;
  }

  async createRespond(templateId: number, answers: AnswerInput[]) {
    const [template] = await this.templateRepository.find({ relations: ['questions'], where: { id: templateId } });
    if (!template) {
      throw new BadRequestException('설문지가 존재하지 않습니다.');
    }
    if (!template.inProgress) {
      throw new BadRequestException('진행중인 설문지가 아닙니다.');
    }

    const respond = this.respondRepository.create({ templateId, answers });
    await this.respondRepository.insert(respond);

    return respond;
  }
}
