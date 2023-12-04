import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TemplateModule } from './template/template.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'nakkim',
      password: 'nakkim@test',
      database: 'survey_dev',
      entities: [__dirname + '/entity/*.entity{.ts,.js}'],
      logging: true,
      synchronize: false,
      namingStrategy: new SnakeNamingStrategy(),
    }),
    TemplateModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
