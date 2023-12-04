import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
