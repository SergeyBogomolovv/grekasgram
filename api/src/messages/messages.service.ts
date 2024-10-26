import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { MessageEntity } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageDto } from './dto/message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { FilesService } from 'src/files/files.service';
import { UsersService } from 'src/users/users.service';
import { EventsGateway } from 'src/events/events.gateway';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessageEntity)
    private messagesRepository: Repository<MessageEntity>,
    private readonly filesService: FilesService,
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => EventsGateway))
    private readonly eventsGateway: EventsGateway,
  ) {}

  async create(
    dto: CreateMessageDto,
    userId: string,
    image?: Express.Multer.File,
  ) {
    let imageUrl: string | null = null;
    if (image) {
      imageUrl = await this.filesService.uploadImage(dto.chatId, image);
    }
    const message = await this.messagesRepository.save(
      this.messagesRepository.create({
        content: dto.content,
        chatId: dto.chatId,
        fromId: userId,
        viewedBy: [{ id: userId }],
        imageUrl,
      }),
    );

    const messageDto = new MessageDto(message, userId);

    this.eventsGateway.notifyMessageSent(messageDto);

    return messageDto;
  }

  async getChatMessages(
    chatId: string,
    userId: string,
    cursor: Date = new Date(),
    count: number = 20,
  ) {
    const messages = await this.messagesRepository.find({
      where: { chatId, createdAt: LessThan(cursor) },
      relations: { viewedBy: true },
      order: { createdAt: 'DESC' },
      take: count,
    });
    return messages.map((message) => new MessageDto(message, userId));
  }

  async editMessage(dto: UpdateMessageDto, userId: string) {
    const message = await this.messagesRepository.findOne({
      where: { id: dto.messageId },
      relations: { viewedBy: true },
    });

    if (!message) throw new NotFoundException('Message not found');

    if (message.fromId !== userId) {
      throw new ForbiddenException('You are not allowed to edit this message');
    }

    message.content = dto.content;
    await this.messagesRepository.save(message);

    return new MessageDto(message);
  }

  async deleteMessage(messageId: string, userId: string) {
    const message = await this.messagesRepository.findOne({
      where: { id: messageId },
      relations: { viewedBy: true },
    });

    if (!message) throw new NotFoundException('Message not found');

    if (message.fromId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to delete this message',
      );
    }

    await this.messagesRepository.softRemove(message);

    return new MessageDto(message);
  }

  async viewMessage(messageId: string, userId: string) {
    const message = await this.messagesRepository.findOne({
      where: { id: messageId },
      relations: { viewedBy: true },
    });

    if (!message) throw new NotFoundException('Message not found');

    const user = await this.usersService.findOneByIdOrFail(userId);

    if (!message.viewedBy.some((user) => user.id === userId)) {
      message.viewedBy.push(user);
      await this.messagesRepository.save(message);
    }

    return new MessageDto(message, userId);
  }
}
