import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { InterviewsController } from './interviews.controller'
import { InterviewsService } from './interviews.service';

@Module({
  imports: [
    MulterModule.register({
      dest: './interviews',
    }),
  ],
  controllers: [InterviewsController],
  providers: [InterviewsService],
})
export class InterviewsModule {}
