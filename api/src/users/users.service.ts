import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Like, Not, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FilesService } from 'src/files/files.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { ChatEntity } from 'src/chats/entities/chat.entity';
import { PublicUserDto } from './dto/public-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly filesService: FilesService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async create(dto: CreateUserDto): Promise<UserDto> {
    const isUserNameExists = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username: dto.username })
      .getExists();

    const isEmailExists = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email: dto.email })
      .getExists();

    if (isUserNameExists || isEmailExists) {
      throw new ConflictException('User already exists');
    }

    const user = await this.userRepository.save(
      this.userRepository.create(dto),
    );

    await this.setUserToCache(user);

    return new UserDto(user);
  }

  async update(id: string, dto: Partial<UserEntity>): Promise<UserDto> {
    const user = await this.findOneByIdOrFail(id);
    const updated = await this.userRepository.save({ ...user, ...dto });

    await this.setUserToCache(updated);

    return new UserDto(updated);
  }

  async addToFavorites(userId: string, chat: ChatEntity) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { favorites: true },
    });
    user.favorites.push(chat);
    await this.userRepository.save(user);
  }

  async removeFromFavorites(userId: string, chatId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { favorites: true },
    });
    user.favorites = user.favorites.filter((c) => c.id !== chatId);
    await this.userRepository.save(user);
  }

  async findOneByIdOrFail(id: string): Promise<UserEntity> {
    const cached = await this.cache.get<UserEntity>(id);
    if (cached) return cached;

    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    await this.setUserToCache(user);

    return user;
  }

  async findOneByEmailOrFail(email: string) {
    const cached = await this.cache.get<UserEntity>(email);
    if (cached) return cached;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    await this.setUserToCache(user);

    return user;
  }

  async findOneByEmail(email: string): Promise<UserEntity | null> {
    const cached = await this.cache.get<UserEntity>(email);
    if (cached) return cached;

    const user = await this.userRepository.findOne({ where: { email } });

    if (user) await this.setUserToCache(user);

    return user;
  }

  async findOneById(id: string): Promise<UserEntity | null> {
    const cached = await this.cache.get<UserEntity>(id);
    if (cached) return cached;

    const user = await this.userRepository.findOne({ where: { id } });

    if (user) await this.setUserToCache(user);

    return user;
  }

  async delete(id: string): Promise<UserEntity | null> {
    const user = await this.findOneById(id);
    if (user) {
      await this.deleteUserFromCache(user);
      return this.userRepository.softRemove(user);
    }
    return null;
  }

  async getProfile(id: string): Promise<UserDto> {
    const user = await this.findOneByIdOrFail(id);
    return new UserDto(user);
  }

  async updateProfile(
    id: string,
    dto: UpdateProfileDto,
    avatar: Express.Multer.File,
  ): Promise<UserDto> {
    const isUserNameExists = await this.userRepository.findOne({
      where: { username: dto.username },
    });
    const user = await this.findOneByIdOrFail(id);

    if (isUserNameExists && user.username !== dto.username) {
      throw new ConflictException('User already exists');
    }
    let avatarUrl = user.avatarUrl;

    if (avatar) {
      avatarUrl = await this.filesService.uploadAvatar(user.id, avatar);
    }

    return this.update(user.id, {
      ...dto,
      avatarUrl,
    });
  }

  async getUserProfile(id: string): Promise<PublicUserDto> {
    const user = await this.findOneByIdOrFail(id);
    return new PublicUserDto(user);
  }

  async searchUsers(query: string, userId: string): Promise<UserDto[]> {
    const users = await this.userRepository.find({
      where: { username: Like(`%${query}%`), id: Not(userId) },
    });

    return users.map((user) => new UserDto(user));
  }

  private async setUserToCache(user: UserEntity) {
    await this.cache.set(user.id, user);
    await this.cache.set(user.email, user);
    await this.cache.set(user.username, user);
  }

  private async deleteUserFromCache(user: UserEntity) {
    await this.cache.del(user.id);
    await this.cache.del(user.email);
    await this.cache.del(user.username);
  }
}
