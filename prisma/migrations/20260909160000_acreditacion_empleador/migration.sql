-- Datos de acreditación de quien publica empleos.
--
-- Todos opcionales: las empresas que ya existen no tienen estos datos y no se
-- las puede dejar en un estado inválido. La obligatoriedad se aplica en el
-- formulario, para los registros nuevos.

CREATE TYPE "EmployerType" AS ENUM ('EMPRESA', 'PARTICULAR');

ALTER TABLE "Company"
  ADD COLUMN IF NOT EXISTS "employerType" "EmployerType" NOT NULL DEFAULT 'EMPRESA',
  ADD COLUMN IF NOT EXISTS "taxId"        TEXT,
  ADD COLUMN IF NOT EXISTS "nationalId"   TEXT,
  ADD COLUMN IF NOT EXISTS "contactName"  TEXT,
  ADD COLUMN IF NOT EXISTS "contactRole"  TEXT,
  ADD COLUMN IF NOT EXISTS "contactPhone" TEXT;

-- Buscar por CUIT al moderar: "¿este CUIT ya publicó antes?" es la primera
-- pregunta ante un aviso sospechoso.
CREATE INDEX IF NOT EXISTS "Company_taxId_idx" ON "Company"("taxId");
