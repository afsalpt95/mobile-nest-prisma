import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PositionService } from './position.service';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { CreatePositionDto } from './dto/create-position';
import { AuthRequest } from 'src/users/user.types';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateDepartmentDto } from 'src/department/dto/create-department';
import {
  successFetchReponseDto,
  SuccessResponseDto,
} from 'src/common/service/common.types';
import { OptionalIntPipe } from 'src/common/pipes/optional-int.pipe';
import { UpdatePositionDto } from './dto/update-postion';

@Controller('position')
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create Position' })
  @ApiBody({ type: CreatePositionDto })
  async create(
    @Req() req: AuthRequest,
    @Body() createPositionDto: CreatePositionDto,
  ): Promise<SuccessResponseDto> {
    const userId = Number(req.user.userId);
    return this.positionService.createPosition(createPositionDto, userId);
  }

  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get All Positions' })
  async getAll(
    @Req() req: AuthRequest,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
    @Query('branchId', OptionalIntPipe) branchId?: number,
  ): Promise<successFetchReponseDto> {
    const userId = Number(req.user.userId);
    return this.positionService.getPositions(
      userId,
      Number(page),
      Number(limit),
      search,
      branchId,
    );
  }

  @UseGuards(AuthGuard)
  @Put(':positionId')
  @ApiOperation({ summary: 'Update Position' })
  @ApiBody({ type: UpdatePositionDto })
  async update(
    @Param('positionId', ParseIntPipe) positionId: number,
    @Req() req: AuthRequest,
    @Body() updatepositionDto: UpdatePositionDto,
  ): Promise<SuccessResponseDto> {
    const userId = Number(req.user.userId);


    
    return this.positionService.updatePosition(
      positionId,
      updatepositionDto,
      userId,
    );
  }


  @UseGuards(AuthGuard)
  @Delete(':positionId')
  @ApiOperation({ summary: 'Delete Position' })
  async delete(
    @Req() req: AuthRequest,
    @Param('positionId', ParseIntPipe) positionId: number,
  ): Promise<SuccessResponseDto> {
    const userId = Number(req.user.userId);
    return this.positionService.deletePosition(userId, positionId);
  }
}
