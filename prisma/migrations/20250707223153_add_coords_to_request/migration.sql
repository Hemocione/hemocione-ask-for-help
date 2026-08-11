/*
  Warnings:

  - You are about to drop the column `photo_url` on the `Assisted` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Assisted" DROP COLUMN "photo_url";

-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "local_latitude" DOUBLE PRECISION,
ADD COLUMN     "local_longitude" DOUBLE PRECISION;
