import { Module } from '@nestjs/common';

import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './services';

@Module({
  controllers: [FeedbackController],
  providers: [FeedbackService]
})
export class FeedbackModule {}
