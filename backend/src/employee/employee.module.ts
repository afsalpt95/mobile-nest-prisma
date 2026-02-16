import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { SharedModule } from 'src/common/common.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { OptionalIntPipe } from 'src/common/pipes/optional-int.pipe';

@Module({
  imports:[SharedModule,PrismaModule],
  controllers: [EmployeeController],
  providers: [EmployeeService,OptionalIntPipe],
})
export class EmployeeModule {}
