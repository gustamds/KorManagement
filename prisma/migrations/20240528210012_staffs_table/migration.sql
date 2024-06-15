-- CreateEnum
CREATE TYPE "EnglishLevel" AS ENUM ('NATIVE', 'FLUENT', 'PROFICIENT', 'ADVANCED', 'UPPER_INTERMEDIATE', 'INTERMEDIATE', 'PRE_INTERMEDIATE', 'ELEMENTARY', 'BEGINNER');

-- CreateEnum
CREATE TYPE "StaffExperience" AS ENUM ('RETAIL', 'HOSPITALITY', 'TRAVEL', 'HEALTHCARE', 'CLEANING', 'NONE');

-- CreateTable
CREATE TABLE "Staff" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "pps" TEXT NOT NULL,
    "euCitizen" BOOLEAN NOT NULL,
    "irelandTime" TEXT NOT NULL,
    "englishLevel" "EnglishLevel" NOT NULL,
    "staffExperience" "StaffExperience" NOT NULL,
    "staffDescribeExperience" TEXT NOT NULL,
    "staffPhoto" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "staffProofOfWork" TEXT NOT NULL,
    "aboutStaff" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Staff_email_key" ON "Staff"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_pps_key" ON "Staff"("pps");
