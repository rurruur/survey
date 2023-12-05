import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './question.entity';

export enum TemplateStatus {
  WAITING = 'waiting',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

registerEnumType(TemplateStatus, { name: 'TemplateStatus' });

@ObjectType()
@Entity()
export class Template {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text' })
  description?: string;

  @Field(() => TemplateStatus)
  @Column({ type: 'enum', enum: TemplateStatus })
  status: TemplateStatus;

  @Field(() => Date)
  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Field(() => Date)
  @Column({ type: 'timestamp' })
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp' })
  deletedAt: Date;

  //

  @OneToMany(() => Question, (question) => question.template)
  questions: Question[];

  isEditable() {
    if (this.deletedAt) {
      return { isEditable: false, reason: '삭제된 설문지입니다.' };
    }
    if (this.status !== TemplateStatus.WAITING) {
      return { isEditable: false, reason: `대기중인 설문지만 수정할 수 있습니다. 현재 설문지 상태: ${this.status}` };
    }

    return { isEditable: true };
  }
}
