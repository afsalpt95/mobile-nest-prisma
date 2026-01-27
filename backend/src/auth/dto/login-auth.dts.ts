import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginAuthDto {
 @ApiProperty({ example:'Afsal@gmail.com'})
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example:'123456'}) 
  @IsString()
  @IsNotEmpty()
  password: string;
}
