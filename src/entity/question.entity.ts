import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Template } from './template.entity';

@ObjectType()
export class Answer {
  @Field(() => String)
  content: string;
  @Field(() => Int)
  score: number;
}

@ObjectType()
@Entity()
export class Question {
  @Field(() => Int)
  @Column({ type: 'int', primary: true })
  templateId: number;

  @Field(() => Int)
  @Column({ type: 'int', primary: true })
  questionNumber: number;

  @Field(() => String)
  @Column({ type: 'text' })
  content: string;

  @Field(() => [Answer])
  @Column({ type: 'jsonb' })
  answers: Answer[];

  @Field(() => Date)
  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Field(() => Date)
  @Column({ type: 'timestamp' })
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  //

  @ManyToOne(() => Template, (template) => template.questions)
  @JoinColumn({ name: 'template_id' })
  template: Template;

  isEditable() {
    const templateResult = this.template.isEditable();
    if (!templateResult.isEditable) {
      return templateResult;
    }

    if (this.deletedAt) {
      return { isEditable: false, reason: '삭제된 문항입니다.' };
    }

    return { isEditable: true };
  }
}
