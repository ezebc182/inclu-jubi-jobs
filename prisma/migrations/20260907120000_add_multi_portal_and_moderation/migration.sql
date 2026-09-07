-- Multi-portal (JubiJobs / InclúJobs), moderación y auditoría.
--
-- Contexto: JubiJobs e InclúJobs son audiencias SEPARADAS que comparten
-- infraestructura. Esta migración agrega la noción de portal al modelo,
-- la cola de moderación de avisos y la traza de acciones administrativas.
--
-- Backfill incluido: los avisos y usuarios existentes quedan en JubiJobs y
-- los avisos ya publicados quedan aprobados, para que nada se apague al migrar.

-- ---------------------------------------------------------------- enums

CREATE TYPE "Portal" AS ENUM ('JUBI', 'INCLU');
CREATE TYPE "ModerationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- ---------------------------------------------------------------- User

ALTER TABLE "User"
  ADD COLUMN "portal"          "Portal" NOT NULL DEFAULT 'JUBI',
  ADD COLUMN "isActive"        BOOLEAN  NOT NULL DEFAULT true,
  ADD COLUMN "suspendedAt"     TIMESTAMP(3),
  ADD COLUMN "suspendedReason" TEXT;

CREATE INDEX "User_portal_role_idx"  ON "User"("portal", "role");
CREATE INDEX "User_createdAt_idx"    ON "User"("createdAt" DESC);

-- ---------------------------------------------------------------- Company

ALTER TABLE "Company"
  ADD COLUMN "autoApproveJobs" BOOLEAN  NOT NULL DEFAULT false,
  ADD COLUMN "isActive"        BOOLEAN  NOT NULL DEFAULT true,
  ADD COLUMN "suspendedAt"     TIMESTAMP(3),
  ADD COLUMN "suspendedReason" TEXT;

CREATE INDEX "Company_isVerified_idx" ON "Company"("isVerified");
CREATE INDEX "Company_createdAt_idx"  ON "Company"("createdAt" DESC);

-- ---------------------------------------------------------------- Job

ALTER TABLE "Job"
  ADD COLUMN "portals"            "Portal"[] NOT NULL DEFAULT ARRAY['JUBI']::"Portal"[],
  ADD COLUMN "accessibilityNotes" TEXT,
  ADD COLUMN "isRemoteFriendly"   BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "hasAccessibleSite"  BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "supportsFlexHours"  BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "moderationStatus"   "ModerationStatus" NOT NULL DEFAULT 'PENDING',
  ADD COLUMN "moderatedAt"        TIMESTAMP(3),
  ADD COLUMN "moderatedById"      TEXT,
  ADD COLUMN "moderationNote"     TEXT;

-- Los avisos nuevos nacen en borrador y pasan por moderación.
ALTER TABLE "Job" ALTER COLUMN "status" SET DEFAULT 'DRAFT';

-- Backfill: todo aviso que YA estaba publicado sigue visible tras la migración.
-- Sin esto, el portal se vaciaría hasta que alguien apruebe uno por uno.
UPDATE "Job"
   SET "moderationStatus" = 'APPROVED',
       "moderatedAt"      = COALESCE("updatedAt", NOW())
 WHERE "status" = 'PUBLISHED';

CREATE INDEX "Job_moderationStatus_createdAt_idx" ON "Job"("moderationStatus", "createdAt" DESC);
CREATE INDEX "Job_createdAt_idx"                   ON "Job"("createdAt" DESC);
-- GIN: habilita el operador `has` de Prisma (`portals @> ARRAY[...]`).
CREATE INDEX "Job_portals_idx" ON "Job" USING GIN ("portals");

-- ---------------------------------------------------------------- SavedSearch

ALTER TABLE "SavedSearch"
  ADD COLUMN "portal" "Portal" NOT NULL DEFAULT 'JUBI';

CREATE INDEX "SavedSearch_userId_portal_idx" ON "SavedSearch"("userId", "portal");

-- ---------------------------------------------------------------- AuditLog

CREATE TABLE "AuditLog" (
    "id"         TEXT NOT NULL,
    "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actorId"    TEXT NOT NULL,
    "action"     TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId"   TEXT NOT NULL,
    "portal"     "Portal",
    "metadata"   JSONB,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AuditLog_actorId_createdAt_idx"  ON "AuditLog"("actorId", "createdAt" DESC);
CREATE INDEX "AuditLog_targetType_targetId_idx" ON "AuditLog"("targetType", "targetId");
CREATE INDEX "AuditLog_createdAt_idx"           ON "AuditLog"("createdAt" DESC);
