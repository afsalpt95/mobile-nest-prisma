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
import { DepartmentService } from './department.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { CreateBranchDto } from 'src/branch/dto/create-branch.dto';
import { AuthRequest } from 'src/users/user.types';
import {
  successFetchReponseDto,
  SuccessResponseDto,
} from 'src/common/service/common.types';
import { CreateDepartmentDto } from './dto/create-department';
import { UpdateDepartmentDto } from './dto/update-department';
import { OptionalIntPipe } from 'src/common/pipes/optional-int.pipe';

@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create Department' })
  @ApiBody({ type: CreateBranchDto })
  async create(
    @Req() req: AuthRequest,
    @Body() createDepartmentDto: CreateDepartmentDto,
  ): Promise<SuccessResponseDto> {
    const userId = Number(req.user.userId);
    return this.departmentService.crerateDepartment(
      createDepartmentDto,
      userId,
    );
  }

  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get All Departments' })
  async getAll(
    @Req() req: AuthRequest,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
    @Query('branchId',OptionalIntPipe) branchId?: number,
  ): Promise<successFetchReponseDto> {
    const userId = Number(req.user.userId);
    return this.departmentService.getDepartments(
      userId,
      Number(page),
      Number(limit),
      search,
      branchId,
    );
  }

  @UseGuards(AuthGuard)
  @Put(':departmentId')
  @ApiOperation({ summary: 'Update Department' })
  @ApiBody({ type: UpdateDepartmentDto })
  async update(
    @Param('departmentId', ParseIntPipe) departmentId: number,
    @Req() req: AuthRequest,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<SuccessResponseDto> {
    const userId = Number(req.user.userId);
    console.log(departmentId,'dpeart');
    console.log(updateDepartmentDto,'dpeartde');
    return this.departmentService.updateDepartment(
      departmentId,
      updateDepartmentDto,
      userId,
    );
  }

  @UseGuards(AuthGuard)
  @Delete(':departmentId')
  @ApiOperation({ summary: 'Delete Department' })
  async delete(
    @Req() req: AuthRequest,
    @Param('departmentId', ParseIntPipe) departmentId: number,
  ): Promise<SuccessResponseDto> {
    const userId = Number(req.user.userId);
    return this.departmentService.deleteDepartment(userId, departmentId);
  }
}

