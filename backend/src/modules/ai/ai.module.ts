import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { OpenaiService } from './openai.service';

@Module({
  imports: [ConfigModule],
  controllers: [AiController],
  providers: [AiService, OpenaiService],
  exports: [AiService],
})
export class AiModule { }
