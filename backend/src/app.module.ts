import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { BranchModule } from './branch/branch.module';
import { UploadModule } from './upload/upload.module';
import { DepartmentModule } from './department/department.module';
import { PositionModule } from './position/position.module';
import { EmployeeModule } from './employee/employee.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    AuthModule,
    UsersModule,
    PrismaModule,
    BranchModule,
    UploadModule,
    DepartmentModule,
    PositionModule,
    EmployeeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
