import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { Conversation } from './conversation.entity';
import { BotMessageService } from '../botMessage/botMessage.service';
import { StoryblokService } from '../botMessage/storyblok.service';
import { DialogFlowService } from '../botMessage/dialogFlow.service';
import { conversationRepositoryMockFactory } from '../spec/factories/conversationRepository';
import { messageRepositoryMockFactory } from '../spec/factories/messageRepository';
import { singleStoryblokResponse } from '../spec/data/singleStoryblokResponse';
import { MessageService } from '../message/message.service';
import { Message } from '../message/message.entity'

jest.mock('../botMessage/storyblok.service');

describe('ConversationController', () => {
  let conversationController: ConversationController;
  let storyblokService: StoryblokService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ConversationController],
      providers: [
        ConversationService,
        {
          provide: getRepositoryToken(Conversation),
          useFactory: conversationRepositoryMockFactory,
        },
        BotMessageService,
        StoryblokService,
        MessageService,
        DialogFlowService,
        {
          provide: getRepositoryToken(Message),
          useFactory: messageRepositoryMockFactory,
        },
      ],
    }).compile();

    conversationController = app.get<ConversationController>(
      ConversationController,
    );
    storyblokService = app.get<StoryblokService>(StoryblokService);
  });

  describe('new', () => {
    test('should return Conversation Opening Object', () => {
      jest
        .spyOn(storyblokService, 'getBotResponsesBySlug')
        .mockResolvedValue([singleStoryblokResponse]);

      return conversationController.newConversation().then(data => {
        expect(data).toContainEqual(
          expect.objectContaining({
            storyblokId: '5b14ea35-3a29-493e-a10d-1ba7bd10c6ca',
          }),
        );
      });
    });
  });
});