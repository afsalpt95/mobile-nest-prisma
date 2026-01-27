import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dts';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('create-admin')
  @ApiOperation({ summary: 'Create admin' })
  @ApiBody({ type: CreateAuthDto })
  async createAdmin(
    @Body() createAuthDto: CreateAuthDto,
  ): Promise<{ success: boolean; message: string; statusCode: number }> {
    return this.authService.createAdmin(createAuthDto);
  }


  @Post('login')
  @ApiOperation({ summary : 'Login User' })
  @ApiBody({ type: LoginAuthDto })
  async login(
    @Body() loginAuthDto : LoginAuthDto):Promise<{
    success: boolean;
    token: string;
    message: string;
    statusCode: number;
    }>{

      return this.authService.userLogin(loginAuthDto)

    }



}
