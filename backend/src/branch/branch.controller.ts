import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BranchService } from './branch.service';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import {
  successFetchReponseDto,
  SuccessObjectResponseDto,
  SuccessResponseDto,
} from 'src/common/service/common.types';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateBranchDto } from './dto/create-branch.dto';
import { AuthRequest } from 'src/users/user.types';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Controller('branch')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create Branch' })
  @ApiBody({ type: CreateBranchDto })
  async create(
    @Req() req: AuthRequest,
    @Body() createBranchDto: CreateBranchDto,
  ): Promise<SuccessResponseDto> {
    const userId = Number(req.user.userId);
    return this.branchService.createBranch(createBranchDto, userId);
  }

  @UseGuards(AuthGuard)
  @Put(':branchId')
  @ApiOperation({ summary: 'Update Branch' })
  @ApiBody({ type: UpdateBranchDto })
  async update(
    @Param('branchId') branchId: number,
    @Req() req: AuthRequest,
    @Body() udpateBranchDto: UpdateBranchDto,
  ): Promise<SuccessResponseDto> {
    const userId = Number(req.user.userId);
    return this.branchService.updateBranch(branchId, udpateBranchDto, userId);
  }

  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get All Branches' })
  async getAll(
    @Req() req: AuthRequest,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<successFetchReponseDto> {
    const userId = Number(req.user.userId);
    return this.branchService.getAllBranches(
      userId,
      Number(page),
      Number(limit),
    );
  }

  @UseGuards(AuthGuard)
  @Delete(':branchId')
  @ApiOperation({ summary: 'Delete Branch' })
  async delete(
    @Req() req: AuthRequest,
    @Param('branchId') branchId: number,
  ): Promise<SuccessResponseDto> {
    const userId = Number(req.user.userId);
    return this.branchService.deleteBranch(userId, branchId);
  }

  @UseGuards(AuthGuard)
  @Get(':branchId')
  @ApiOperation({ summary: 'Delete Branch' })
  async getOneBranch(
    @Req() req: AuthRequest,
    @Param('branchId') branchId: number,
  ): Promise<SuccessObjectResponseDto> {
    const userId = Number(req.user.userId);
    return this.branchService.getOneBranch(userId, branchId);
  }
}
