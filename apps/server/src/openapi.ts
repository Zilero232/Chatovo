import { DocumentBuilder } from '@nestjs/swagger';

export const buildOpenApiConfig = () => {
  return new DocumentBuilder()
    .setTitle('Chatovo API')
    .setVersion('0.1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'bearerAuth')
    .build();
};
