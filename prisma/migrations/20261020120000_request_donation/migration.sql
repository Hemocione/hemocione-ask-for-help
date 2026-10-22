
-- CreateEnum
CREATE TYPE "public"."RequestDonationStatus" AS ENUM ('Declared', 'Verified');

-- DropForeignKey
ALTER TABLE "public"."RequestDonators" DROP CONSTRAINT "RequestDonators_request_id_fkey";

-- DropTable
DROP TABLE "public"."RequestDonators";

-- CreateTable
CREATE TABLE "public"."RequestDonation" (
    "id" SERIAL NOT NULL,
    "request_id" INTEGER NOT NULL,
    "donor_id" TEXT NOT NULL,
    "donation_id" INTEGER NOT NULL,
    "status" "public"."RequestDonationStatus" NOT NULL DEFAULT 'Declared',
    "verification_method" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RequestDonation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RequestDonation_donation_id_key" ON "public"."RequestDonation"("donation_id");

-- CreateIndex
CREATE UNIQUE INDEX "RequestDonation_request_id_donor_id_key" ON "public"."RequestDonation"("request_id", "donor_id");

-- AddForeignKey
ALTER TABLE "public"."RequestDonation" ADD CONSTRAINT "RequestDonation_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "public"."Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;
