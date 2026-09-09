-- Campos que el adaptador de Prisma de Better-Auth 1.4 escribe al vincular una
-- cuenta OAuth. Sin ellos el insert se rechaza entero y el login termina en
-- `unable_to_create_user`.
--
-- IF NOT EXISTS para que sea seguro correrla dos veces.
ALTER TABLE "Account" ADD COLUMN IF NOT EXISTS "scope" TEXT;
ALTER TABLE "Account" ADD COLUMN IF NOT EXISTS "accessTokenExpiresAt" TIMESTAMP(3);
ALTER TABLE "Account" ADD COLUMN IF NOT EXISTS "refreshTokenExpiresAt" TIMESTAMP(3);
