import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { UserHelper } from 'src/common/service/user-helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEmployeeDto } from './dto/employee.create.dto';
import {
  successFetchReponseDto,
  SuccessResponseDto,
} from 'src/common/service/common.types';
import { Prisma } from 'src/generated/prisma';

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

  async updateEmployee(
    empId: number, // from params
    dto: CreateEmployeeDto,
    userId: number,
  ): Promise<SuccessResponseDto> {
    const user = await this.userHelper.getUserOrThrow(userId);

    // Check employee exists
    const existingEmployee = await this.prisma.employee.findUnique({
      where: { id: empId },
    });

    if (!existingEmployee) {
      throw new BadRequestException('Employee not found');
    }

    const branchId = await this.userHelper.resolveBranchId(
      user,
      dto.branchId ?? existingEmployee.branchId,
    );

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

    if (dto.empId && dto.empId !== existingEmployee.empId) {
      const empIdExists = await this.prisma.employee.findFirst({
        where: {
          empId: dto.empId,
          NOT: {
            id: empId, // exclude current employee
          },
        },
      });

      if (empIdExists) {
        throw new BadRequestException('Employee ID already exists');
      }
    }

    await this.prisma.employee.update({
      where: { id: empId },
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
      message: 'Employee updated successfully',
      statusCode: HttpStatus.OK,
    };
  }

  async getEmployees(
    userId: number,
    page = 1,
    limit = 10,
    search?: string,
    branchId?: number,
  ): Promise<successFetchReponseDto> {
    const user = await this.userHelper.getUserOrThrow(userId);

    page = Math.max(page, 1);
    limit = Math.max(limit, 1);

    const skip = (page - 1) * limit;

    /*
       Reusable branch resolver
    */
    const branchIds = await this.userHelper.userBranchIs(user, branchId);

    if (branchIds.length === 0) {
      return {
        success: true,
        statusCode: HttpStatus.OK,
        data: [],
        pagination: {
          totalItems: 0,
          totalPages: 0,
          currentPage: page,
          limit,
        },
      };
    }

    const whereCondition: Prisma.EmployeeWhereInput = {
      branchId: { in: branchIds },
    };

    /*
     Search
    */
    if (search?.trim()) {
      whereCondition.OR = [
        {
          emp_name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          empId: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          phone: {
            contains: search,
          },
        },
      ];
    }

    const [employees, totalCount] = await Promise.all([
      this.prisma.employee.findMany({
        where: whereCondition,
        select: {
          id: true,
          emp_name: true,
          empId: true,
          email: true,
          phone: true,
          gender: true,
          dateOfBirth: true,
          dateOfJoining: true,
          salary: true,
          createdAt: true,

          branch: {
            select: {
              id: true,
              name: true,
            },
          },

          department: {
            select: {
              id: true,
              dept_name: true,
            },
          },

          position: {
            select: {
              id: true,
              pos_name: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),

      this.prisma.employee.count({
        where: whereCondition,
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: employees,
      pagination: {
        totalItems: totalCount,
        totalPages,
        currentPage: page,
        limit,
      },
    };
  }
}
