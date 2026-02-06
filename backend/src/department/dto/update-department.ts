import { PartialType } from '@nestjs/swagger';
import { CreateDepartmentDto } from './create-department';

export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {}
