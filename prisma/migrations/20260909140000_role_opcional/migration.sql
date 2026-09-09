-- El rol deja de tener valor por defecto: se define cuando la persona elige en
-- /onboarding. Con `@default(CANDIDATE)`, quien entraba con Google quedaba
-- marcado como candidato sin que se le preguntara, y era imposible registrarse
-- como empresa.
--
-- Solo se quita el default y se permite NULL. Las filas existentes conservan su
-- rol: nadie pierde el suyo.
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" DROP NOT NULL;
