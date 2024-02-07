import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'

import { AuthModule } from './auth/auth.module'
import { PrismaModule } from './prisma/prisma.module'
import { UsersModule } from './users/users.module'
import { TeamsModule } from './teams/teams.module'
import { InterviewsModule } from './interviews/interviews.module'

@Module({
  imports: [
    ServeStaticModule.forRoot(
      {
        rootPath: join(__dirname, '..', '..', 'materials'),
        serveRoot: '/materials',
        serveStaticOptions: {
          index: false,
        },
      },
      {
        rootPath: join(__dirname, '..', '..', 'materials', 'thumbnails'),
        serveRoot: '/thumbnails',
        serveStaticOptions: {
          index: false,
        },
      }
    ),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    UsersModule,
    TeamsModule,
    InterviewsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
