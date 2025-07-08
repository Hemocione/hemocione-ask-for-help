/*
  Warnings:

  - Made the column `local_latitude` on table `Request` required. This step will fail if there are existing NULL values in that column.
  - Made the column `local_longitude` on table `Request` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Request" ALTER COLUMN "local_latitude" SET NOT NULL,
ALTER COLUMN "local_longitude" SET NOT NULL;
