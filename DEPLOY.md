# Salir a producción

Pasos en orden. No saltear el 3: sin un admin, `/admin` redirige a la home.

## 1. Subir la rama

La clave SSH tiene que estar cargada en el agente:

```bash
ssh-add ~/.ssh/id_ed25519
git push -u origin feat/multi-portal-pwa-a11y
```

Si preferís HTTPS con el token de `gh`:

```bash
gh auth setup-git
git push -u origin feat/multi-portal-pwa-a11y
```

## 2. Migraciones

**Se aplican solas en cada deploy.** El `build` corre `prisma migrate deploy`
antes de compilar, así que no hay paso manual.

```
build: prisma generate && prisma migrate deploy && next build
```

Antes solo hacía `prisma generate`, que genera el cliente TypeScript pero no
toca la base. El resultado: el código se desplegaba esperando columnas que la
base no tenía, y las consultas de Prisma fallaban en producción sin que el
build diera error. Así se rompió el login con Google —`unable_to_create_user`—
cuando el modelo `Account` quedó tres columnas atrás de lo que escribe
Better-Auth.

Si una migración falla, el build falla y el deploy no sale. Eso es
intencional: es preferible no desplegar a desplegar contra una base
incompatible.

### Correrla a mano

Solo hace falta para aplicar una migración sin desplegar:

```bash
DATABASE_URL="<url-de-produccion>" pnpm exec prisma migrate deploy
```

### Antes de mergear una migración

Leé el SQL. `migrate deploy` no pide confirmación y no se puede deshacer solo:
un `DROP COLUMN` o un `NOT NULL` sobre datos existentes se lleva puesto lo que
haya. Las migraciones aditivas —columnas nuevas y opcionales— son seguras.

## 3. Crear el primer administrador

El primer admin no se puede crear desde la interfaz — sería un agujero de
seguridad. Se hace en dos pasos:

1. Iniciá sesión normalmente en el sitio con tu email.
2. Corré:

```bash
DATABASE_URL="<url-de-produccion>" pnpm admin:grant tu-email@ejemplo.com
```

Después de eso te aparece "Administración" en el header.

## 4. Variables de entorno en Vercel

| Variable                         | Valor                         | Notas                         |
| -------------------------------- | ----------------------------- | ----------------------------- |
| `DATABASE_URL`                   | connection string de Postgres |                               |
| `AUTH_SECRET`                    | 32+ caracteres aleatorios     | `openssl rand -base64 32`     |
| `BETTER_AUTH_URL`                | `https://jubijobs.com`        | Por dominio, ver abajo        |
| `BETTER_AUTH_GOOGLE_ID`          | client id de Google OAuth     |                               |
| `BETTER_AUTH_GOOGLE_SECRET`      | client secret                 |                               |
| `NEXT_PUBLIC_USERWAY_ACCOUNT_ID` | `6s9F7XAeLa`                  | Opcional: ya está por defecto |
| `NEXT_PUBLIC_BASE_URL`           | _(no setear en prod)_         | Solo para previews            |
| `RESEND_API_KEY_JUBI`            | api key de Resend             | Restringida a `jubijobs.com`  |
| `RESEND_API_KEY_INCLU`           | api key de Resend             | Restringida a `inclujobs.com` |

### Emails con Resend

Los correos transaccionales —confirmación de postulación, aviso a la empresa,
solicitud de contacto, aviso aprobado o rechazado— salen por Resend desde
`lib/email.ts`.

Hay **una API key por portal**, creada en Resend con acceso de envío
restringido a su dominio. Si una se filtra, solo sirve para mandar desde ese
dominio. Sin la key de un portal no se envía nada desde ese portal: se loguea
el intento en consola y la acción sigue igual. Así en local y en previews no
hace falta configurar nada.

Cada persona recibe correo del portal donde se registró, con remitente
`JubiJobs <hola@jubijobs.com>` o `IncluJobs <hola@inclujobs.com>`. Para que
Resend acepte esos remitentes, hay que verificar **los dos dominios** en
Resend → Domains y cargar en el DNS de cada uno los registros que indica
(SPF, DKIM y el de retorno). Sin verificar el dominio, Resend rechaza el envío
y queda en el log como `[email] Resend rechazó el envío`.

Las casillas `hola@` tienen que existir y leerse: son el remitente, así que
las respuestas de la gente llegan ahí. Para esta audiencia, responder un mail
es lo natural.

### Sobre `NEXT_PUBLIC_BASE_URL`

No hace falta en producción. `portalBaseUrl()` deriva la URL del dominio de
cada portal, y **ignora esta variable si apunta a un dominio productivo** —
así una configuración equivocada no puede hacer que IncluJobs publique
canonical y sitemap apuntando a jubijobs.com.

Es útil solo en previews de Vercel o en local, donde querés fijar una URL
que no es ninguno de los dos dominios reales.

## 5. Dominios

En Vercel → Settings → Domains, agregá los dos al **mismo** proyecto:

- `jubijobs.com` (+ `www.jubijobs.com`)
- `inclujobs.com` (+ `www.inclujobs.com`)

El middleware (`proxy.ts`) resuelve el portal por el header `Host`. No hace
falta configurar nada más: `lib/portal.ts` ya mapea ambos dominios, sus
variantes `www` y los previews de Vercel.

### OAuth de Google

Agregá los callbacks de **los dos** dominios en la consola de Google Cloud:

```
https://jubijobs.com/api/auth/callback/google
https://inclujobs.com/api/auth/callback/google
```

Sin esto, el login falla en el dominio que falte.

## 6. Verificación post-deploy

En cada dominio, comprobá:

- [ ] `/manifest.webmanifest` devuelve el nombre y los iconos correctos
      (`JubiJobs` + iconos `jubi-*`, `IncluJobs` + iconos `inclu-*`)
- [ ] `/robots.txt` apunta al sitemap del dominio correcto
- [ ] `/sitemap.xml` lista solo los avisos de ese portal
- [ ] El logo y los colores del header son los de la marca
- [ ] En Chrome móvil aparece la invitación a instalar
- [ ] Con la app instalada y el modo avión activado, abre `/offline`
- [ ] Un aviso publicado solo en JubiJobs **no** se ve en inclujobs.com,
      ni siquiera con la URL directa
- [ ] `/admin` redirige a la home para un usuario sin rol ADMIN
- [ ] El widget de UserWay carga en la esquina

## Pendientes conocidos

- **SMS de producción**: `lib/auth.ts` loguea el OTP por consola en
  desarrollo y no envía nada en producción. Falta integrar Twilio o
  equivalente para que el login por teléfono funcione en prod.
- **Prisma 7** está disponible; el proyecto usa 6.19. Migrar después de
  estabilizar, no antes.
- **Logos**: son SVG geométricos generados por código, sólidos y
  distinguibles. Si más adelante hay identidad visual profesional, se
  reemplazan los símbolos en `lib/brand-assets.ts` y se corre
  `pnpm icons:generate`.
