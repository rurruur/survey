import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { Repository } from 'typeorm';
import { Respond } from '../entity/respond.entity';
import { Template } from '../entity/template.entity';
import { AnswerInput } from './input/answer.input';

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

  async updateRespond(respondId: number, answers: AnswerInput[]) {
    const respond = await this.respondRepository.findOneBy({ id: respondId });
    if (!respond) {
      throw new BadRequestException('답변이 존재하지 않습니다.');
    }
    if (respond.isSubmitted) {
      throw new BadRequestException('이미 제출된 답변입니다.');
    }

    Object.assign(respond, { answers });
    await this.respondRepository.update({ id: respondId }, respond);

    return respond;
  }

  async submitRespond(respondId: number) {
    const respond = await this.respondRepository.findOneBy({ id: respondId });
    if (!respond) {
      throw new BadRequestException('답변이 존재하지 않습니다.');
    }
    if (respond.isSubmitted) {
      throw new BadRequestException('이미 제출된 답변입니다.');
    }

    const template = await this.templateRepository.findOne({
      relations: ['questions'],
      where: { id: respond.templateId },
    });
    if (!template) {
      throw new BadRequestException('설문지가 존재하지 않습니다.');
    }
    if (!template.inProgress) {
      throw new BadRequestException('진행중인 설문지가 아닙니다.');
    }

    if (_.uniqBy(respond.answers, 'questionNumber').length !== _.uniqBy(template.questions, 'questionNumber').length) {
      throw new BadRequestException('답변이 완료되지 않았습니다.');
    }

    const answers = respond.answers.map((answer) => {
      const question = template.questions.find((q) => q.questionNumber === answer.questionNumber);
      if (!question) {
        throw new BadRequestException(`질문이 존재하지 않습니다. (questionNumber: ${answer.questionNumber})})`);
      }

      const option = question.options.find((o) => o.content === answer.content);
      if (!option) {
        throw new BadRequestException(`선택지가 존재하지 않습니다. (content: ${answer.content})`);
      }

      return { ...answer, score: option.score };
    });

    respond.isSubmitted = true;
    respond.totalScore = answers.reduce((acc, cur) => acc + cur.score, 0);
    await this.respondRepository.save(respond);

    return respond;
  }

  async deleteRespond(respondId: number) {
    const respond = await this.respondRepository.findOne({ where: { id: respondId }, withDeleted: true });
    if (!respond) {
      throw new BadRequestException('답변이 존재하지 않습니다.');
    }
    if (respond.deletedAt) {
      throw new BadRequestException('이미 삭제된 답변입니다.');
    }

    await this.respondRepository.softDelete({ id: respondId });

    return true;
  }
}
