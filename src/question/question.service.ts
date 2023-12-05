import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { Repository } from 'typeorm';
import { Answer, Question } from '../entity/question.entity';
import { Template } from '../entity/template.entity';

@Injectable()
export class QuestionService {
  private readonly logger = new Logger(QuestionService.name);
  constructor(
    @InjectRepository(Question) private readonly questionRepository: Repository<Question>,
    @InjectRepository(Template) private readonly templateRepository: Repository<Template>,
  ) {}

  async getQuestionList(templateId: number) {
    const questions = await this.questionRepository.find({ where: { templateId } });

    return questions;
  }

  /** 설문지 상태가 대기중인 경우만 생성 가능 */
  async createQuestion(templateId: number, content: string, answers: Answer[]) {
    const template = await this.templateRepository.findOneBy({ id: templateId });
    if (!template) {
      throw new BadRequestException('설문지가 존재하지 않습니다.');
    }

    const { isEditable, reason } = template.isEditable();
    if (isEditable === false) {
      throw new BadRequestException(reason);
    }

    const questionNumber = (await this.questionRepository.count({ where: { templateId } })) + 1;
    const question = this.questionRepository.create({ templateId, questionNumber, content, answers });

    await this.questionRepository.insert(question);
    this.logger.log(`설문지 문항 생성: ${JSON.stringify(question)}`);

    return this.questionRepository.findOneBy({ templateId, questionNumber });
  }

  /** 설문지 상태가 대기중이고 문항이 삭제되지 않은 경우만 수정 가능 */
  async updateQuestion(templateId: number, questionNumber: number, content?: string, answers?: Answer[]) {
    const [question] = await this.questionRepository.find({
      relations: ['template'],
      where: { templateId, questionNumber },
    });
    if (!question) {
      throw new BadRequestException('문항이 존재하지 않습니다.');
    }

    const { isEditable, reason } = question.isEditable();
    if (isEditable === false) {
      throw new BadRequestException(reason);
    }

    Object.assign(question, { ...(content && { content }), ...(answers && { answers }) });

    await this.questionRepository.update({ templateId, questionNumber }, question);
    this.logger.log(`설문지 문항 수정: ${JSON.stringify(question)}`);

    return question;
  }

  /** 설문지 상태가 대기중인 경우만 삭제 가능 */
  async deleteQuestion(templateId: number, questionNumber: number) {
    const [question] = await this.questionRepository.find({
      relations: ['template'],
      where: { templateId, questionNumber },
    });
    if (!question) {
      throw new BadRequestException('문항이 존재하지 않습니다.');
    }

    const { isEditable, reason } = question.isEditable();
    if (isEditable === false) {
      throw new BadRequestException(reason);
    }

    await this.questionRepository.save({ ...question, deletedAt: dayjs() });
    this.logger.log(`설문지 문항 삭제: ${templateId}번 설문지의 ${questionNumber}번 문항`);

    return true;
  }
}
