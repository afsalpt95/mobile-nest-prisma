import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';


export class CreateAuthDto {
   @ApiProperty({ example:'Afsal'})
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example:'Afsal@gmail.com'})
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example:'123456'})
  @IsString()
  @IsNotEmpty()
  password: string;
}