import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsArray, ArrayMinSize, IsInt } from "class-validator";
import { Type } from "class-transformer";

export class CreateDepartmentDto {
  @ApiProperty({ example: 'IT' })
  @IsString()
  @IsNotEmpty()
  dept_name: string;

  @ApiProperty({ 
    example: [1, 2, 3], 
    description: 'Array of branch IDs',
    type: [Number] 
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one branch ID is required' })
  @IsInt({ each: true })
  @Type(() => Number)
  @IsNotEmpty()
  branchIds: number[];
}