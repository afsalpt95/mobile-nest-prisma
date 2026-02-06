import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department';
import {
  successFetchReponseDto,
  SuccessResponseDto,
} from 'src/common/service/common.types';
import { UserHelper } from 'src/common/service/user-helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from 'src/users/user.types';
import { Prisma } from 'src/generated/prisma';
import { UpdateDepartmentDto } from './dto/update-department';

@Injectable()
export class DepartmentService {
  constructor(
    private readonly userHelper: UserHelper,
    private readonly prisma: PrismaService,
  ) {}

  async crerateDepartment(
    dto: CreateDepartmentDto,
    userId: number,
  ): Promise<SuccessResponseDto> {
    const user = await this.userHelper.getUserOrThrow(userId);

    let branchIds: number[] = [];

    //  If branchIds provided → validate & use
    if (dto.branchIds && dto.branchIds.length > 0) {
      const count = await this.prisma.branch.count({
        where: { id: { in: dto.branchIds } },
      });

      if (count !== dto.branchIds.length) {
        throw new BadRequestException('Invalid branchIds provided');
      }

      branchIds = dto.branchIds;
      //auto assign based on role
    } else {
      if (user.role === Role.Admin) {
        const branches = await this.prisma.branch.findMany({
          where: {
            adminId: user.id,
          },
          select: { id: true },
        });

        branchIds = branches.map((b) => b.id);
      } else if (user.role === Role.user) {
        if (!user.branchId) {
          throw new BadRequestException('User is not assigned to any branch');
        }

        branchIds = [user.branchId];
      }
    }

    if (branchIds.length === 0) {
      throw new BadRequestException('No branches available to assign');
    }

    // check duplicate department inside same branches
    const existing = await this.prisma.department.findFirst({
      where: {
        dept_name: dto.dept_name,
        branches: {
          some: {
            id: { in: branchIds },
          },
        },
      },
    });

    if (existing) {
      throw new BadRequestException(
        'Department name already exists in one of the selected branches',
      );
    }

    await this.prisma.department.create({
      data: {
        dept_name: dto.dept_name,
        branches: {
          connect: branchIds.map((id) => ({ id })),
        },
      },
    });

    return {
      success: true,
      message: 'Department created successfully',
      statusCode: HttpStatus.CREATED,
    };
  }

  async getDepartments(
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

    /*
   Where condition
  */
    const whereCondition: Prisma.DepartmentWhereInput = {
      branches: {
        some: {
          id: { in: branchIds },
        },
      },
    };

    /*
     Search
  */
    if (search?.trim()) {
      whereCondition.dept_name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    /*
     Query
  */
    const [departments, totalCount] = await Promise.all([
      this.prisma.department.findMany({
        where: whereCondition,
        include: {
          branches: true, // optional, useful for frontend
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.department.count({
        where: whereCondition,
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: departments,
      pagination: {
        totalItems: totalCount,
        totalPages,
        currentPage: page,
        limit,
      },
    };
  }

  async updateDepartment(
    departmentId: number,
    dto: UpdateDepartmentDto,
    userId: number,
  ): Promise<SuccessResponseDto> {
    await this.userHelper.getUserOrThrow(userId);

    const department = await this.prisma.department.findUnique({
      where: { id: departmentId },
      include: { branches: true },
    });

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    let branchIds: number[] = dto.branchIds ?? [];

    //  validate branchIds
    if (branchIds.length > 0) {
      const count = await this.prisma.branch.count({
        where: { id: { in: branchIds } },
      });

      if (count !== branchIds.length) {
        throw new BadRequestException('Invalid branchIds provided');
      }
    }

    //  prevent duplicate inside same branches
    if (dto.dept_name) {
      const existing = await this.prisma.department.findFirst({
        where: {
          id: { not: departmentId }, // ignore current department
          dept_name: dto.dept_name,
          branches: {
            some: {
              id: { in: branchIds },
            },
          },
        },
      });

      if (existing) {
        throw new BadRequestException(
          'Department name already exists in one of the selected branches',
        );
      }
    }

    //  update with REPLACE logic
    await this.prisma.department.update({
      where: { id: departmentId },
      data: {
        dept_name: dto.dept_name,
        branches: {
          set: branchIds.map((id) => ({ id })), //  replaces all
        },
      },
    });

    return {
      success: true,
      message: 'Department updated successfully',
      statusCode: HttpStatus.OK,
    };
  }
  

  async deleteBranch(
    userId: number,
    departmentId: number,
  ): Promise<SuccessResponseDto> {
    await this.userHelper.getUserOrThrow(userId);

    await this.prisma.department.delete({
      where: { id: departmentId },
    });

    return {
      success: true,
      message: 'Branch deleted successfully',
      statusCode: HttpStatus.OK,
    };
  }
}
