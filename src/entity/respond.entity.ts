import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Template } from './template.entity';

@ObjectType()
export class Answer {
  @Field(() => Int)
  questionNumber: string;

  @Field(() => String)
  content: string;

  @Field(() => Int)
  score: number;
}

@ObjectType()
@Entity()
export class Respond {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column({ type: 'int' })
  templateId: number;

  @Field(() => [Answer])
  @Column({ type: 'jsonb' })
  answers: Answer[];

  @Field(() => Boolean)
  @Column({ type: 'boolean', default: false })
  isSubmitted: boolean;

  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  totalScore: number; // 제출시 총점을 계산하여 저장

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  //

  @ManyToOne(() => Template, (template) => template.questions)
  @JoinColumn({ name: 'template_id' })
  template: Template;
}
