/*
  Warnings:

  - You are about to drop the column `bloodType` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `medicalNotes` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone]` on the table `doctors` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[socialId]` on the table `doctors` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `patients` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phone` to the `doctors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `patients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `patients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'UNSPECIFIED');

-- AlterTable
ALTER TABLE "doctors" ADD COLUMN     "gender" "Gender" NOT NULL DEFAULT 'UNSPECIFIED',
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "socialId" TEXT,
ALTER COLUMN "specialization" DROP NOT NULL,
ALTER COLUMN "licenseNumber" DROP NOT NULL;

-- AlterTable
ALTER TABLE "patients" DROP COLUMN "bloodType",
DROP COLUMN "fullName",
DROP COLUMN "gender",
DROP COLUMN "medicalNotes",
ADD COLUMN     "emergencyContact" VARCHAR(255),
ADD COLUMN     "emergencyPhone" VARCHAR(20),
ADD COLUMN     "height" DECIMAL(5,2),
ADD COLUMN     "medicalHistory" TEXT,
ADD COLUMN     "occupation" VARCHAR(255),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD COLUMN     "weight" DECIMAL(5,2),
ALTER COLUMN "dateOfBirth" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "hashedRefreshToken" TEXT,
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "examinations" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "subjectivePainScale" SMALLINT,
    "subjectiveLocation" VARCHAR(255),
    "subjectiveDescription" TEXT,
    "subjectiveAggravatingFactors" TEXT,
    "objectivePosture" VARCHAR(255),
    "objectiveRegion" VARCHAR(255),
    "objectivePhysiologicalMotion" TEXT,
    "palpation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "examinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "progression_notes" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "progression_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "treatment_plans" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "treatment_plans_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "examinations_patientId_createdAt_idx" ON "examinations"("patientId", "createdAt");

-- CreateIndex
CREATE INDEX "progression_notes_patientId_idx" ON "progression_notes"("patientId");

-- CreateIndex
CREATE INDEX "treatment_plans_patientId_idx" ON "treatment_plans"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_phone_key" ON "doctors"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_socialId_key" ON "doctors"("socialId");

-- CreateIndex
CREATE UNIQUE INDEX "patients_userId_key" ON "patients"("userId");

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "examinations" ADD CONSTRAINT "examinations_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progression_notes" ADD CONSTRAINT "progression_notes_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "treatment_plans" ADD CONSTRAINT "treatment_plans_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
