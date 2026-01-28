import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { SuccessObjectResponseDto } from 'src/common/service/common.types';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get(':userId')
  async findOne(
    @Param('userId') userId: string,
  ): Promise<SuccessObjectResponseDto> {
    return this.usersService.findOne(userId);
  }
}
