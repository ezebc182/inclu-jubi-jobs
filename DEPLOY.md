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

## 2. Aplicar la migración

La migración está en `prisma/migrations/20260907120000_add_multi_portal_and_moderation/`.
Revisá el SQL antes de correrla.

```bash
# Contra la base productiva
DATABASE_URL="<url-de-produccion>" pnpm exec prisma migrate deploy
```

Incluye backfill defensivo: los avisos que ya estaban `PUBLISHED` quedan
`APPROVED` y no se apagan.

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

### Sobre `NEXT_PUBLIC_BASE_URL`

No hace falta en producción. `portalBaseUrl()` deriva la URL del dominio de
cada portal, y **ignora esta variable si apunta a un dominio productivo** —
así una configuración equivocada no puede hacer que InclúJobs publique
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
      (`JubiJobs` + iconos `jubi-*`, `InclúJobs` + iconos `inclu-*`)
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
- **Notificaciones por email**: `contactCandidate` cambia el estado de la
  postulación pero no le avisa al candidato.
- **Prisma 7** está disponible; el proyecto usa 6.19. Migrar después de
  estabilizar, no antes.
- **Logos**: son SVG geométricos generados por código, sólidos y
  distinguibles. Si más adelante hay identidad visual profesional, se
  reemplazan los símbolos en `lib/brand-assets.ts` y se corre
  `pnpm icons:generate`.
