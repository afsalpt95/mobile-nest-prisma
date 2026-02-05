import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserHelper } from 'src/common/service/user-helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { Role } from 'src/users/user.types';
import {
  successFetchReponseDto,
  SuccessObjectResponseDto,
  SuccessResponseDto,
} from 'src/common/service/common.types';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { Branch } from 'src/generated/prisma';

@Injectable()
export class BranchService {
  constructor(
    private readonly userHelperService: UserHelper,
    private readonly prisma: PrismaService,
  ) {}

  async createBranch(
    dto: CreateBranchDto,
    userId: number,
  ): Promise<SuccessResponseDto> {
    const user = await this.userHelperService.getUserOrThrow(userId);

    if (user.role !== Role.Admin) {
      throw new ForbiddenException('Only admin can create branch');
    }

    const branchExists = await this.prisma.branch.findUnique({
      where: { name: dto.name },
    });

    if (branchExists) {
      throw new BadRequestException('Branch already exists');
    }

    await this.prisma.branch.create({
      data: {
        ...dto,
        adminId: user.id,
      },
    });

    return {
      success: true,
      message: 'Branch created successfully',
      statusCode: HttpStatus.CREATED,
    };
  }

  async updateBranch(
    branchId: number,
    dto: UpdateBranchDto,
    userId: number,
  ): Promise<SuccessResponseDto> {
    const user = await this.userHelperService.getUserOrThrow(userId);

    if (user.role !== Role.Admin) {
      throw new ForbiddenException('Only admin can update branch');
    }

    const branch = await this.prisma.branch.findUnique({
      where: { id: branchId },
    });

    if (!branch) {
      throw new BadRequestException('Branch not found');
    }

    if (dto.name && dto.name !== branch.name) {
      const exists = await this.prisma.branch.findUnique({
        where: { name: dto.name },
      });

      if (exists) {
        throw new BadRequestException('Branch name already exists');
      }
    }

    await this.prisma.branch.update({
      where: { id: branchId },
      data: {
        name: dto.name,
        email: dto.email,
        address: dto.address,
        contact: dto.contact,
        logo: dto.logo,
        city: dto.city,
        state: dto.state,
      },
    });

    return {
      success: true,
      message: 'Branch updated successfully',
      statusCode: HttpStatus.OK,
    };
  }

  async getAllBranches(
    userId: number,
    page = 1,
    limit = 10,
  ): Promise<successFetchReponseDto> {
    const user = await this.userHelperService.getUserOrThrow(userId);

    const skip = (page - 1) * limit;

    let branches: Branch[] = [];
    let totalCount = 0;

    if (user.role === Role.Admin) {
      // Admin → multiple branches
      [branches, totalCount] = await Promise.all([
        this.prisma.branch.findMany({
          where: {
            adminId: user.id,
          },
          skip,
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
        }),
        this.prisma.branch.count({
          where: {
            adminId: user.id,
          },
        }),
      ]);
    } else if (user.role === Role.user) {
      const branch = user.branchId
        ? await this.prisma.branch.findUnique({ where: { id: user.branchId } })
        : null;

      branches = branch ? [branch] : [];
      totalCount = branches.length;
    } else {
      throw new ForbiddenException('Invalid role');
    }

    const totalPages = Math.ceil(totalCount / limit);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: branches,
      pagination: {
        totalItems: totalCount,
        totalPages,
        currentPage: page,
        limit,
      },
    };
  }

  async deleteBranch(
    userId: number, // usually numeric in PostgreSQL
    branchId: number,
  ): Promise<SuccessResponseDto> {
    // 1. Get user and check role
    const user = await this.userHelperService.getUserOrThrow(userId);
    if (user.role !== Role.Admin) {
      throw new ForbiddenException('Only admin can delete branch');
    }

    // 2. Delete branch
    await this.prisma.branch.delete({
      where: { id: branchId },
    });

    // 3. Return response
    return {
      success: true,
      message: 'Branch deleted successfully',
      statusCode: HttpStatus.OK,
    };
  }

  async getOneBranch(
    userId: number,
    branchId: number,
  ): Promise<SuccessObjectResponseDto> {
    const branchIdNum = Number(branchId);
    if (isNaN(branchIdNum)) {
      throw new BadRequestException('Invalid branch id');
    }

    // 2️Get the user
    await this.userHelperService.getUserOrThrow(userId);

    // 3 Fetch branch
    const branch = await this.prisma.branch.findUnique({
      where: { id: branchIdNum },
    });

    if (!branch) {
      throw new NotFoundException('Branch not found');
    }

    // 4️ Return response
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: branch,
    };
  }
}
