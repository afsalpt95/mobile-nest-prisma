import { PartialType } from '@nestjs/swagger';
import { CreateEmployeeDto } from './employee.create.dto';


export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {}