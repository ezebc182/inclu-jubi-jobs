-- CreateEnum
CREATE TYPE "CallSlot" AS ENUM ('MORNING', 'AFTERNOON', 'ANYTIME');

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "callPhone" TEXT,
ADD COLUMN     "callSlot" "CallSlot",
ADD COLUMN     "contactedAt" TIMESTAMP(3),
ADD COLUMN     "reviewedAt" TIMESTAMP(3);

-- Las postulaciones que ya avanzaron no tienen fecha propia: updatedAt es la
-- mejor aproximación disponible, y es mejor que mostrar el estado sin fecha.
UPDATE "Application" SET "reviewedAt" = "updatedAt" WHERE "status" = 'REVIEWED';
UPDATE "Application" SET "contactedAt" = "updatedAt" WHERE "status" = 'CONTACTED';
