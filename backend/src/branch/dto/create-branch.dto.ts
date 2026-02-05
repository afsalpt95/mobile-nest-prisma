import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBranchDto {
 @ApiProperty({ example:'Reset'})
   @IsString()
   @IsNotEmpty()
   name: string;

   @ApiProperty({ example:'reset@gmail.com'})
   @IsString()
   @IsNotEmpty()
   email: string;

   @ApiProperty({ example:'vaikam muhammed nagar near ashok nagar'})
   @IsString()
   @IsNotEmpty()
   address: string;

   @ApiProperty({ example:'Kavanur'})
   @IsString()
   @IsNotEmpty()
   city: string;

   @ApiProperty({ example:'Andhra Pradesh'})
   @IsString()
   @IsNotEmpty()
   state: string;

   @ApiProperty({ example:'+91 1234567890'})
   @IsString()
   contact: string;

   @ApiProperty({ example:'logo url' , nullable:true})
   @IsString()
   @IsOptional()
   logo?: string | null;
}
