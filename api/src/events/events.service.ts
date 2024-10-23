import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async getUserChatIds(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: { chats: true },
    });

    return user.chats.map((chat) => chat.id);
  }

  async setOnline(userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    user.online = true;
    await this.usersRepository.save(user);
  }

  async setOffline(userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    user.online = false;
    user.lastOnlineAt = new Date();
    await this.usersRepository.save(user);
  }
}
