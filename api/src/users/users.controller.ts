import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { HttpUser } from 'src/common/http-user.decorator';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserDto } from './dto/user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Получение информации о профиле' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserDto, description: 'Get user profile' })
  @Get('me')
  getProfile(@HttpUser('userId') userId: string) {
    return this.usersService.getProfile(userId);
  }

  @ApiOperation({ summary: 'Обновление профиля пользователя' })
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: UserDto })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar'))
  @Post('update-profile')
  updateUsersProfile(
    @HttpUser('userId') userId: string,
    @UploadedFile() avatar: Express.Multer.File,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(userId, dto, avatar);
  }
}
