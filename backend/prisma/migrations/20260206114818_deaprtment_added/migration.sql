-- CreateTable
CREATE TABLE "departments" (
    "id" SERIAL NOT NULL,
    "dept_name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DepartmentBranches" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_DepartmentBranches_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "departments_dept_name_key" ON "departments"("dept_name");

-- CreateIndex
CREATE INDEX "_DepartmentBranches_B_index" ON "_DepartmentBranches"("B");

-- AddForeignKey
ALTER TABLE "_DepartmentBranches" ADD CONSTRAINT "_DepartmentBranches_A_fkey" FOREIGN KEY ("A") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DepartmentBranches" ADD CONSTRAINT "_DepartmentBranches_B_fkey" FOREIGN KEY ("B") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
