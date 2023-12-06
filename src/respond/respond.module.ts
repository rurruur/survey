import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Respond } from '../entity/respond.entity';
import { Template } from '../entity/template.entity';
import { RespondResolver } from './respond.resolver';
import { RespondService } from './respond.service';

@Module({
  imports: [TypeOrmModule.forFeature([Respond, Template])],
  providers: [RespondService, RespondResolver],
})
export class RespondModule {}
