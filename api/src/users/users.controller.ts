import {
  Body,
  Controller,
  Get,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserDto } from './dto/user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { HttpAuthGuard } from 'src/auth/guards/http-auth.guard';
import { HttpUser } from 'src/auth/decorators/http-user.decorator';

@UseGuards(HttpAuthGuard)
@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Получение информации о профиле' })
  @ApiOkResponse({ type: UserDto, description: 'Get user profile' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('me')
  getProfile(@HttpUser('userId') userId: string) {
    return this.usersService.getProfile(userId);
  }

  @ApiOperation({ summary: 'Обновление профиля пользователя' })
  @ApiCreatedResponse({ type: UserDto })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar'))
  @Put('update-profile')
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  updateUsersProfile(
    @HttpUser('userId') userId: string,
    @UploadedFile() avatar: Express.Multer.File,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(userId, dto, avatar);
  }

  @ApiOperation({ summary: 'Поиск пользователей' })
  @ApiOkResponse({ type: [UserDto] })
  @ApiQuery({ name: 'query', type: String, required: true })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('search')
  searchUsers(
    @Query('query') query: string,
    @HttpUser('userId') userId: string,
  ) {
    return this.usersService.searchUsers(query, userId);
  }
}
