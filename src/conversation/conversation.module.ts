import { Module } from '@nestjs/common';
import { ConversationController } from './conversation.controller';
import { ConversationService }from './conversation.service';

@Module({
  imports: [],
  controllers: [ConversationController],
  providers: [ConversationService],
})

export class ConversationModule {}
