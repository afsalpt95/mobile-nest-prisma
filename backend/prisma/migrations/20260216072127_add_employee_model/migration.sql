-- CreateTable
CREATE TABLE "employees" (
    "id" SERIAL NOT NULL,
    "empId" TEXT NOT NULL,
    "emp_name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "gender" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "dateOfJoining" TIMESTAMP(3),
    "salary" DOUBLE PRECISION,
    "branchId" INTEGER NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "posistionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "employees_empId_key" ON "employees"("empId");

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_posistionId_fkey" FOREIGN KEY ("posistionId") REFERENCES "positions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
