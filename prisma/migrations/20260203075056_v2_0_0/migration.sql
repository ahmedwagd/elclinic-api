/*
  Warnings:

  - The primary key for the `appointments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `appointments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `doctor_schedules` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `doctor_schedules` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `doctors` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `doctors` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `examinations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `examinations` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `medical_records` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `medical_records` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `patients` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `patients` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `progression_notes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `progression_notes` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `treatment_plans` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `treatment_plans` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `doctorId` on the `appointments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `patientId` on the `appointments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `doctorId` on the `doctor_schedules` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `patientId` on the `examinations` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `appointmentId` on the `medical_records` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `patientId` on the `progression_notes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `patientId` on the `treatment_plans` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_patientId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_schedules" DROP CONSTRAINT "doctor_schedules_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "examinations" DROP CONSTRAINT "examinations_patientId_fkey";

-- DropForeignKey
ALTER TABLE "medical_records" DROP CONSTRAINT "medical_records_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "progression_notes" DROP CONSTRAINT "progression_notes_patientId_fkey";

-- DropForeignKey
ALTER TABLE "treatment_plans" DROP CONSTRAINT "treatment_plans_patientId_fkey";

-- AlterTable
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "doctorId",
ADD COLUMN     "doctorId" INTEGER NOT NULL,
DROP COLUMN "patientId",
ADD COLUMN     "patientId" INTEGER NOT NULL,
ADD CONSTRAINT "appointments_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "doctor_schedules" DROP CONSTRAINT "doctor_schedules_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "doctorId",
ADD COLUMN     "doctorId" INTEGER NOT NULL,
ADD CONSTRAINT "doctor_schedules_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "doctors" DROP CONSTRAINT "doctors_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "doctors_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "examinations" DROP CONSTRAINT "examinations_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "patientId",
ADD COLUMN     "patientId" INTEGER NOT NULL,
ADD CONSTRAINT "examinations_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "medical_records" DROP CONSTRAINT "medical_records_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "appointmentId",
ADD COLUMN     "appointmentId" INTEGER NOT NULL,
ADD CONSTRAINT "medical_records_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "patients" DROP CONSTRAINT "patients_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "patients_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "progression_notes" DROP CONSTRAINT "progression_notes_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "patientId",
ADD COLUMN     "patientId" INTEGER NOT NULL,
ADD CONSTRAINT "progression_notes_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "treatment_plans" DROP CONSTRAINT "treatment_plans_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "patientId",
ADD COLUMN     "patientId" INTEGER NOT NULL,
ADD CONSTRAINT "treatment_plans_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "examinations_patientId_createdAt_idx" ON "examinations"("patientId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "medical_records_appointmentId_key" ON "medical_records"("appointmentId");

-- CreateIndex
CREATE INDEX "progression_notes_patientId_idx" ON "progression_notes"("patientId");

-- CreateIndex
CREATE INDEX "treatment_plans_patientId_idx" ON "treatment_plans"("patientId");

-- AddForeignKey
ALTER TABLE "examinations" ADD CONSTRAINT "examinations_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progression_notes" ADD CONSTRAINT "progression_notes_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "treatment_plans" ADD CONSTRAINT "treatment_plans_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_schedules" ADD CONSTRAINT "doctor_schedules_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_records" ADD CONSTRAINT "medical_records_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
