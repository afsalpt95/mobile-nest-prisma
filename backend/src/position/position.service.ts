import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { UserHelper } from 'src/common/service/user-helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePositionDto } from './dto/create-position';
import {
  successFetchReponseDto,
  SuccessResponseDto,
} from 'src/common/service/common.types';
import { Prisma } from 'src/generated/prisma';
import { UpdatePositionDto } from './dto/update-postion';

@Injectable()
export class PositionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userHelper: UserHelper,
  ) {}

  async createPosition(
    dto: CreatePositionDto,
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

    const uniquePositions = [...new Set(dto.positions)];

    const existing = await this.prisma.position.findMany({
      where: {
        pos_name: { in: uniquePositions },
        departmentId: dto.departmentId,
        branchId: branchId,
      },
      select: { pos_name: true },
    });

    if (existing.length > 0) {
      const names = existing.map((d) => d.pos_name).join(', ');
      throw new BadRequestException(
        `Position ${names} already exist in this branch!`,
      );
    }

    await this.prisma.$transaction(
      uniquePositions.map((name) =>
        this.prisma.position.create({
          data: {
            pos_name: name,
            departmentId: dto.departmentId,
            branchId: branchId,
          },
        }),
      ),
    );

    return {
      success: true,
      message: 'Position created successfully',
      statusCode: HttpStatus.CREATED,
    };
  }

  async getPositions(
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

    const whereCondition: Prisma.PositionWhereInput = {
      branchId: { in: branchIds },
    };

    /*
   Search
  */
    if (search?.trim()) {
      whereCondition.pos_name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    const [positions, totalCount] = await Promise.all([
      this.prisma.position.findMany({
        where: whereCondition,
        select: {
          id: true,
          pos_name: true,
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
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),

      this.prisma.position.count({
        where: whereCondition,
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: positions,
      pagination: {
        totalItems: totalCount,
        totalPages,
        currentPage: page,
        limit,
      },
    };
  }

  async updatePosition(
    positionId: number,
    dto: UpdatePositionDto,
    userId: number,
  ): Promise<SuccessResponseDto> {
    const user = await this.userHelper.getUserOrThrow(userId);

    const branchId = await this.userHelper.resolveBranchId(user, dto.branchId);

    // Check if position exists
    const existingPosition = await this.prisma.position.findUnique({
      where: { id: positionId },
    });

    if (!existingPosition) {
      throw new BadRequestException('Position not found');
    }

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

    // Check duplicate (exclude current record)
    const duplicate = await this.prisma.position.findFirst({
      where: {
        pos_name: dto.pos_name,
        departmentId: dto.departmentId,
        branchId: branchId,
        NOT: {
          id: positionId,
        },
      },
    });

    if (duplicate) {
      throw new BadRequestException(
        `Position ${dto.pos_name} already exist in this branch!`,
      );
    }

    // Update
    await this.prisma.position.update({
      where: { id: positionId },
      data: {
        pos_name: dto.pos_name,
        departmentId: dto.departmentId,
        branchId: branchId,
      },
    });

    return {
      success: true,
      message: 'Position updated successfully',
      statusCode: HttpStatus.OK,
    };
  }

  async deletePosition(
    userId: number,
    positionId: number,
  ): Promise<SuccessResponseDto> {
    await this.userHelper.getUserOrThrow(userId);

    await this.prisma.position.delete({
      where: { id: positionId },
    });

    return {
      success: true,
      message: 'Branch deleted successfully',
      statusCode: HttpStatus.OK,
    };
  }
}
