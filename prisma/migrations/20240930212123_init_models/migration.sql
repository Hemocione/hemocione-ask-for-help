-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('Pending', 'Approved', 'Declined');

-- CreateEnum
CREATE TYPE "BloodType" AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');

-- CreateTable
CREATE TABLE "Request" (
    "id" SERIAL NOT NULL,
    "requester_id" INTEGER NOT NULL,
    "assisted_id" INTEGER NOT NULL,
    "local_name" TEXT NOT NULL,
    "review_status" "RequestStatus" DEFAULT 'Pending',
    "active_campagin" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assisted" (
    "id" SERIAL NOT NULL,
    "cpf" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "blood_type" "BloodType" NOT NULL,
    "photo_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Assisted_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestDonators" (
    "id" SERIAL NOT NULL,
    "request_id" INTEGER NOT NULL,
    "donator_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RequestDonators_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Assisted_cpf_key" ON "Assisted"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "RequestDonators_donator_id_key" ON "RequestDonators"("donator_id");

-- CreateIndex
CREATE UNIQUE INDEX "RequestDonators_request_id_donator_id_key" ON "RequestDonators"("request_id", "donator_id");

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_assisted_id_fkey" FOREIGN KEY ("assisted_id") REFERENCES "Assisted"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestDonators" ADD CONSTRAINT "RequestDonators_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;
