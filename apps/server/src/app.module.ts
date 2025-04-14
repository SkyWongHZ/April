import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './logger/winston.config';

@Module({
  imports: [
    PrismaModule,
    WinstonModule.forRoot(winstonConfig),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
