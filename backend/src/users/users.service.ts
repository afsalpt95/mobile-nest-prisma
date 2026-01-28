import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAuthDto } from 'src/auth/dto/create-auth.dto';
import { Role } from './user.types';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  successFetchReponseDto,
  SuccessObjectResponseDto,
  SuccessResponseDto,
} from 'src/common/service/common.types';
import { LoginAuthDto } from 'src/auth/dto/login-auth.dts';
import * as bcrypt from 'bcrypt';
import { User } from 'src/generated/prisma';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async createAdmin(createuserDto: CreateAuthDto) {
    const { email, password, name } = createuserDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    return this.prisma.user.create({
      data: {
        name,
        email,
        password,
        role: Role.Admin,
      },
    });
  }

  async userLogin(loginAuthDto: LoginAuthDto) {
    const { email, password } = loginAuthDto;
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isPasswordValid) {
      throw new ConflictException('Invalid user credentials');
    }

    const { password: _, ...userWithoutPassword } = existingUser;

    return userWithoutPassword;
  }

  async findOne(id: string): Promise<SuccessObjectResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      success: true,
      data: user,
      statusCode: HttpStatus.OK,
    };
  }
}
