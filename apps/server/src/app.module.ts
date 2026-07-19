import { extname } from 'node:path';
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';

import { bindDomainEventEmitter } from './common/events/emit-domain-event';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { AppConfigModule } from './config/config.module';
import { INLINE_IMAGE_EXTENSIONS } from './config/uploads';
import { env, PrismaModule } from './core';
import { AuthModule } from './modules/auth/auth.module';
import { ChatModule } from './modules/chat/chat.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { FriendsModule } from './modules/friends/friends.module';
import { GithubModule } from './modules/github/github.module';
import { HealthModule } from './modules/health/health.module';
import { LivekitModule } from './modules/livekit/livekit.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { PushModule } from './modules/push/push.module';
import { RealtimeModule } from './modules/realtime/realtime.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { UPLOADS_DIR } from './modules/uploads';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    AppConfigModule,
    PrismaModule,
    EventEmitterModule.forRoot(),
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          env.NODE_ENV === 'development'
            ? { target: 'pino-pretty', options: { singleLine: true } }
            : undefined,
        autoLogging: false,
      },
    }),
    ThrottlerModule.forRoot({
      throttlers: [{ name: 'default', ttl: 60_000, limit: 120 }],
    }),
    ServeStaticModule.forRoot({
      rootPath: UPLOADS_DIR,
      serveRoot: '/uploads',
      serveStaticOptions: {
        setHeaders: (res, path) => {
          if (INLINE_IMAGE_EXTENSIONS.has(extname(path).toLowerCase())) {
            res.setHeader('Content-Disposition', 'inline');
            res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

            return;
          }

          res.setHeader('Content-Disposition', 'attachment');
          res.setHeader('Content-Security-Policy', "default-src 'none'; sandbox");
        },
      },
    }),
    AuthModule,
    NotificationsModule,
    HealthModule,
    RoomsModule,
    UsersModule,
    ChatModule,
    FriendsModule,
    FeedbackModule,
    GithubModule,
    LivekitModule,
    PushModule,
    RealtimeModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {
  constructor(eventEmitter: EventEmitter2) {
    bindDomainEventEmitter((event, payload) => {
      eventEmitter.emit(event, payload);
    });
  }
}
