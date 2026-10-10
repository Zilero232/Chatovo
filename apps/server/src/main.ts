import type { NestExpressApplication } from '@nestjs/platform-express';

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

import 'reflect-metadata';

const app = await NestFactory.create<NestExpressApplication>(AppModule, {
  bodyParser: false,
  bufferLogs: true
});

app.useLogger(app.get(Logger));

// Every request arrives through exactly one proxy (Caddy). Trusting that hop makes
// req.ip the client from X-Forwarded-For, so the throttler limits each visitor
// instead of one bucket shared by the whole site.
app.set('trust proxy', 1);
app.useWebSocketAdapter(new WsAdapter(app));

app.use(helmet({ contentSecurityPolicy: false }));
app.enableCors({
  origin: allowedOrigins,
  credentials: true,
  exposedHeaders: ['set-auth-token']
});

app.use('/livekit/webhook', raw({ type: '*/*' }));
app.use(json());
app.use(urlencoded({ extended: true }));

app.useGlobalPipes(new ZodValidationPipe());

app.enableShutdownHooks();

if (env.NODE_ENV !== 'production') {
  SwaggerModule.setup('docs', app, () =>
    cleanupOpenApiDoc(SwaggerModule.createDocument(app, buildOpenApiConfig()))
  );
}

await app.listen(env.PORT);
