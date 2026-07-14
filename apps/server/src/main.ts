import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import { SwaggerModule } from '@nestjs/swagger';
import { json, raw, urlencoded } from 'express';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { cleanupOpenApiDoc, ZodValidationPipe } from 'nestjs-zod';

import { AppModule } from './app.module';
import { allowedOrigins } from './config/cors';
import { env } from './core';
import { buildOpenApiConfig } from './openapi';

const app = await NestFactory.create(AppModule, {
  bodyParser: false,
  bufferLogs: true,
});

app.useLogger(app.get(Logger));
app.useWebSocketAdapter(new WsAdapter(app));

app.use(helmet({ contentSecurityPolicy: false }));
app.enableCors({
  origin: allowedOrigins,
  credentials: true,
  exposedHeaders: ['set-auth-token'],
});

app.use('/livekit/webhook', raw({ type: '*/*' }));
app.use(json());
app.use(urlencoded({ extended: true }));

app.useGlobalPipes(new ZodValidationPipe());

app.enableShutdownHooks();

SwaggerModule.setup('docs', app, () =>
  cleanupOpenApiDoc(SwaggerModule.createDocument(app, buildOpenApiConfig())),
);

await app.listen(env.PORT);
