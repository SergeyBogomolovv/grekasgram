import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FilesService } from 'src/files/files.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly filesService: FilesService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async create(dto: CreateUserDto): Promise<UserDto> {
    const isUserNameExists = await this.userRepository.findOne({
      where: { username: dto.username },
    });
    const isEmailExists = await this.userRepository.findOne({
      where: { email: dto.email },
    });

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
      return this.userRepository.remove(user);
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

  async searchUsers(query: string): Promise<UserDto[]> {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username LIKE :query', { query: `%${query}%` })
      .orWhere('user.email LIKE :query', { query: `%${query}%` })
      .getMany();
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
