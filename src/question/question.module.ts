import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from '../entity/question.entity';
import { Template } from '../entity/template.entity';
import { QuestionResolver } from './question.resolver';
import { QuestionService } from './question.service';

@Module({
  imports: [TypeOrmModule.forFeature([Question, Template])],
  providers: [QuestionService, QuestionResolver],
})
export class QuestionModule {}
