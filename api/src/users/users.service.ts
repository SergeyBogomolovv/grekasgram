import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly filesService: FilesService,
  ) {}

  async create(dto: CreateUserDto) {
    const isUserNameExists = await this.userRepository.findOne({
      where: { username: dto.username },
    });
    const isEmailExists = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (isUserNameExists || isEmailExists) {
      throw new ConflictException('User already exists');
    }

    const user = this.userRepository.create(dto);
    return this.userRepository.save(user);
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.findOneByIdOrFail(id);
    return this.userRepository.save({ ...user, ...dto });
  }

  async findOneByIdOrFail(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findOneByEmailOrFail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  findOneById(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }

  delete(id: string) {
    return this.userRepository.delete({ id });
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
    const updatedUser = await this.userRepository.save({
      ...user,
      ...dto,
      avatarUrl,
    });
    return new UserDto(updatedUser);
  }
}
