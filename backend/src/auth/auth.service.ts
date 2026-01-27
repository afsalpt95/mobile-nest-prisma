import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { LoginAuthDto } from './dto/login-auth.dts';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async createAdmin(
    createAuthDto: CreateAuthDto,
  ): Promise<{ success: boolean; message: string; statusCode: number }> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(createAuthDto.password, salt);

    await this.userService.createAdmin({
      ...createAuthDto,
      password: hash,
    });

    return {
      success: true,
      message: 'User created successfully',
      statusCode: HttpStatus.CREATED,
    };
  }

  async userLogin(
    loginAuthDto: LoginAuthDto,
  ): Promise<{
    success: boolean;
    message: string;
    statusCode: number;
    token: string;
  }> {
    const user = await this.userService.userLogin(loginAuthDto);
    const payload = { userId: user.id, email:user.email };
    const token = await this.jwtService.signAsync(payload);

    return {
      token:token,
      success: true,
      message: 'User created successfully',
      statusCode: HttpStatus.CREATED,
    };
  }
}
