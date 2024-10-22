import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageEntity } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageDto } from './dto/message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessageResponse } from 'src/common/message-response';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessageEntity)
    private messagesRepository: Repository<MessageEntity>,
    private readonly filesService: FilesService,
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

    return new MessageDto(message);
  }

  async getChatMessages(chatId: string) {
    const messages = await this.messagesRepository.find({
      where: { chatId },
      relations: { viewedBy: true },
      order: { createdAt: 'ASC' },
    });
    return messages.map((message) => new MessageDto(message));
  }

  async editMessage(messageId: string, dto: UpdateMessageDto, userId: string) {
    const message = await this.messagesRepository.findOne({
      where: { id: messageId },
    });

    if (!message) throw new NotFoundException('Message not found');

    if (message.fromId !== userId) {
      throw new ForbiddenException('You are not allowed to edit this message');
    }

    message.content = dto.content;
    await this.messagesRepository.save(message);

    return new MessageResponse('Message edited successfully');
  }

  async deleteMessage(messageId: string, userId: string) {
    const message = await this.messagesRepository.findOne({
      where: { id: messageId },
    });

    if (!message) throw new NotFoundException('Message not found');

    if (message.fromId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to delete this message',
      );
    }

    await this.messagesRepository.softRemove(message);

    return new MessageResponse('Message deleted successfully');
  }
}
