import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { UserHelper } from 'src/common/service/user-helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEmployeeDto } from './dto/employee.create.dto';
import { SuccessResponseDto } from 'src/common/service/common.types';

@Injectable()
export class EmployeeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userHelper: UserHelper,
  ) {}

  async createEmployee(
    dto: CreateEmployeeDto,
    userId: number,
  ): Promise<SuccessResponseDto> {
    const user = await this.userHelper.getUserOrThrow(userId);

    const branchId = await this.userHelper.resolveBranchId(user, dto.branchId);

    // Validate Department
    const department = await this.prisma.department.findUnique({
      where: { id: dto.departmentId },
      include: { branches: true },
    });

    if (!department) {
      throw new BadRequestException('Department not found');
    }

    const validDepartment = department.branches.some((b) => b.id === branchId);

    if (!validDepartment) {
      throw new BadRequestException(
        'Department does not belong to selected branch',
      );
    }

    // Validate position
    const position = await this.prisma.position.findFirst({
      where: {
        id: dto.positionId,
        branchId: branchId,
        departmentId: dto.departmentId,
      },
    });

    if (!position) {
      throw new BadRequestException('Invalid position for this department');
    }

    await this.prisma.employee.create({
      data: {
        empId: dto.empId,
        emp_name: dto.emp_name,
        email: dto.email,
        phone: dto.phone,
        gender: dto.gender,
        dateOfBirth: dto.dateOfBirth,
        dateOfJoining: dto.dateOfJoining,
        salary: dto.salary,
        departmentId: dto.departmentId,
        posistionId: dto.positionId,
        branchId: branchId,
      },
    });

    return {
      success: true,
      message: 'Employee created successfully',
      statusCode: HttpStatus.CREATED,
    };
  }
}
