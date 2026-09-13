-- CreateEnum
CREATE TYPE "LeadKind" AS ENUM ('CANDIDATE', 'COMPANY');

-- DropIndex
DROP INDEX "Job_portals_idx";

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "portal" "Portal" NOT NULL,
    "kind" "LeadKind" NOT NULL,
    "province" TEXT,
    "wantsRemote" BOOLEAN NOT NULL DEFAULT false,
    "notifiedAt" TIMESTAMP(3),

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Lead_portal_kind_notifiedAt_idx" ON "Lead"("portal", "kind", "notifiedAt");

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "Lead_email_portal_kind_key" ON "Lead"("email", "portal", "kind");

-- CreateIndex
CREATE INDEX "Job_portals_idx" ON "Job"("portals");
