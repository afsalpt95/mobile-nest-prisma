import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsString,
  IsDateString,
  IsEmail,
} from "class-validator";

export class CreateEmployeeDto {

  @ApiProperty({ example: 'EMP001' })
  @IsString()
  @IsNotEmpty()
  empId: string;

  @ApiProperty({ example: 'Afsal' })
  @IsString()
  @IsNotEmpty()
  emp_name: string;

  @ApiProperty({ example: 'male or female' })
  @IsString()
  @IsNotEmpty()
  gender: string;

  @ApiProperty({ example: 'test@gmail.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '9876543210', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: '1998-01-01', required: false })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiProperty({ example: '2024-01-01', required: false })
  @IsOptional()
  @IsDateString()
  dateOfJoining?: string;

  @ApiProperty({ example: 25000, required: false })
  @IsOptional()
  @IsNumber()
  salary?: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  departmentId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  positionId: number;

  @ApiProperty({ example: 2, required: false })
  @IsNumber()
  @IsOptional()
  branchId?: number;
}
