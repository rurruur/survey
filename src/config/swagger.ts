import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const setupSwagger = async (app: INestApplication) => {
  const config = new DocumentBuilder().setTitle('설문조사').setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, config);

  if (process.env.NODE_ENV === 'develop') {
    SwaggerModule.setup('api', app, document);
  }
};

export default setupSwagger;
