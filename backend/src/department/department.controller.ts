import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { CreateBranchDto } from 'src/branch/dto/create-branch.dto';
import { AuthRequest } from 'src/users/user.types';
import { SuccessResponseDto } from 'src/common/service/common.types';
import { CreateDepartmentDto } from './dto/create-department';

@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}


  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create Branch' })
  @ApiBody({ type: CreateBranchDto })
  async create(
    @Req() req: AuthRequest,
    @Body()  createDepartmentDto: CreateDepartmentDto,
  ): Promise<SuccessResponseDto> {
    const userId = Number(req.user.userId);
    return this.departmentService.crerateDepartment(createDepartmentDto, userId);
  }

}
