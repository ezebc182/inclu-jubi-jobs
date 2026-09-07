# JubiJobs 🧑‍💼

<div align="center">

**Plataforma de empleos para personas jubiladas y con discapacidad en Argentina**

[![Next.js](https://img.shields.io/badge/Next.js-16.1.0-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2.3-blue?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

_Sin LinkedIn, sin vueltas. Solo tres preguntas y un click._

[Demo](#) · [Documentación](#-documentación-adicional) · [Reportar Bug](../../issues) · [Solicitar Feature](../../issues)

</div>

---

## 📖 Sobre el Proyecto

JubiJobs es una plataforma fullstack diseñada para conectar a personas jubiladas y con discapacidad con oportunidades laborales en Argentina. Prioriza la **accesibilidad**, **simplicidad** y **dignidad** en cada interacción.

### ✨ Características Principales

- 🚀 **Onboarding en 1 paso**: Login con Google/Microsoft/Facebook o teléfono (SMS OTP)
- ♿ **100% Accesible**: Diseño WCAG AA compliant, tipografía grande, alto contraste
- 📱 **Responsive**: Optimizado para móviles y tablets
- 🌙 **Dark Mode**: Soporte nativo con next-themes
- 🔐 **Seguro**: Autenticación robusta con Better-Auth
- 📧 **Notificaciones**: Sistema de emails para candidatos y empresas
- 🇦🇷 **Argentinizado**: i18n en español argentino, provincias, formato de fecha/moneda

## 🚀 Stack Tecnológico

| Categoría         | Tecnología                                           |
| ----------------- | ---------------------------------------------------- |
| **Framework**     | Next.js 16.1.0 (App Router, React Server Components) |
| **UI Library**    | React 19.2.3                                         |
| **Lenguaje**      | TypeScript 5.7                                       |
| **Base de datos** | PostgreSQL (Neon)                                    |
| **ORM**           | Prisma 6.1                                           |
| **Autenticación** | Better-Auth (OAuth + Phone OTP)                      |
| **Estilos**       | Tailwind CSS 3.4 + Radix UI                          |
| **Validación**    | Zod 3.24                                             |
| **Emails**        | Nodemailer (dev) / Resend (prod)                     |
| **Testing**       | Playwright                                           |
| **Build Tool**    | Turbopack                                            |
| **Deploy**        | Vercel (recomendado)                                 |

## 📋 Requisitos Previos

- Node.js >= 20.0.0
- pnpm (recomendado) o npm
- PostgreSQL (Neon recomendado)
- Credenciales OAuth de Google/Microsoft/Facebook (al menos una)

## 🛠️ Instalación

### 1. Clonar el repositorio

```bash
git clone <url-repo>
cd jubijobs
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Configurar variables de entorno

Copiar `.env.example` a `.env` y completar:

```bash
cp .env.example .env
```

**Variables obligatorias:**

```env
# Database
DATABASE_URL="postgresql://USER:PASS@HOST/db?sslmode=require"

# Auth
AUTH_SECRET="min-32-chars-random-secret"
BETTER_AUTH_URL="http://localhost:3000"

# OAuth Providers (al menos uno)
BETTER_AUTH_GOOGLE_ID="..."
BETTER_AUTH_GOOGLE_SECRET="..."

# Email (opcional para dev)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="tu-email@gmail.com"
SMTP_PASS="tu-app-password"
EMAIL_FROM="noreply@jubijobs.com"
```

### 4. Setup de base de datos

```bash
# Generar cliente Prisma
pnpm prisma generate

# Ejecutar migraciones
pnpm db:migrate

# Cargar datos de prueba (opcional)
pnpm db:seed
```

### 5. Ejecutar en desarrollo

```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000)

## 🗂️ Estructura del Proyecto

```
jubijobs/
├── app/
│   ├── (public)/              # Rutas públicas
│   │   ├── page.tsx           # Home
│   │   ├── empleos/           # Listado y detalle de empleos
│   │   ├── empresas/          # Landing para empresas
│   │   ├── discapacidad/      # Página de inclusión
│   │   ├── como-funciona/
│   │   ├── accesibilidad/
│   │   ├── privacidad/
│   │   └── terminos/
│   ├── (private)/
│   │   ├── empresa/           # Dashboard empresa
│   │   └── postulaciones/     # Mis postulaciones (candidato)
│   ├── api/
│   │   └── auth/[...all]/     # Better-Auth routes
│   ├── actions/               # Server Actions
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── layout/                # Header, Footer
│   ├── ui/                    # Componentes UI base
│   ├── forms/                 # Formularios
│   ├── jobs/                  # Componentes de empleos
│   └── applications/          # Componentes de postulaciones
├── lib/
│   ├── auth.ts               # Better-Auth config
│   ├── auth-client.ts        # Cliente auth
│   ├── db.ts                 # Prisma client
│   ├── email.ts              # Envío de emails
│   ├── constants.ts          # Constantes (provincias, etc.)
│   └── validations.ts        # Esquemas Zod
├── prisma/
│   ├── schema.prisma         # Modelos de BD
│   └── seed.ts               # Datos de prueba
├── .env.example
├── package.json
└── README.md
```

## 📊 Modelos de Datos

### User

- Rol: `CANDIDATE | COMPANY | ADMIN`
- Perfil candidato: 3 preguntas, ubicación, año nacimiento
- Discapacidad: tipo y necesidades de accesibilidad

### Company

- Empresa asociada a un User (1:1)
- Datos: nombre, logo, website, ubicación

### Job

- Publicado por Company
- Datos: título, descripción, provincia, ciudad, modalidad, jornada, salario
- Estados: `DRAFT | PUBLISHED | PAUSED | CLOSED`

### Application

- Candidato se postula a Job
- Guarda snapshot de las 3 respuestas
- Estados: `SUBMITTED | REVIEWED | CONTACTED | REJECTED`

## 🎯 Flujos Principales

### Candidato

1. **Login**: OAuth (Google/Facebook/Microsoft) o teléfono con SMS OTP
2. **Onboarding**:
   - Elegir "Busco trabajo"
   - Completar 3 preguntas + ubicación
   - (Opcional) Marcar discapacidad
3. **Explorar empleos**: Filtrar por provincia, modalidad, jornada
4. **Postularse**: Responder 3 preguntas (prellenadas del perfil)
5. **Ver postulaciones**: Estado de cada postulación

### Empresa

1. **Login**: OAuth
2. **Onboarding**:
   - Elegir "Soy empresa"
   - Completar datos de empresa
3. **Publicar empleo**: Formulario simple
4. **Ver postulaciones**: Filtrar, revisar respuestas
5. **Contactar candidato**: Botón que envía email y marca como contactado

## 🔑 Features Principales

### Autenticación por Teléfono (SMS OTP)

**En Desarrollo:**

- El código OTP es **aleatorio de 6 dígitos**
- Se muestra en la consola del servidor (terminal donde corre `npm run dev`)
- La UI indica dónde buscar el código

**En Producción:**

- Configurar servicio de SMS (Twilio recomendado)
- El código se envía por SMS real
- Variables de entorno necesarias:
  ```env
  TWILIO_ACCOUNT_SID="..."
  TWILIO_AUTH_TOKEN="..."
  TWILIO_PHONE_NUMBER="+1234567890"
  ```

**Flujo:**

1. Usuario ingresa número de teléfono (formato argentino: +54)
2. Sistema genera y envía código OTP de 6 dígitos
3. Usuario ingresa código para verificar
4. Si es nuevo, se crea cuenta automáticamente
5. Si existe, inicia sesión

### Accesibilidad (A11y)

- Tipografía grande (base 18-20px)
- Alto contraste
- Botones grandes (mín 44px)
- Labels a la izquierda
- Skip to content
- Navegación por teclado
- ARIA labels
- Soporte lector de pantalla

### i18n (es-AR)

- Formato de fecha: dd/mm/aaaa
- Moneda: ARS (Intl.NumberFormat)
- Zona horaria: America/Argentina/Buenos_Aires

### Emails

- Confirmación de postulación (candidato)
- Nueva postulación (empresa)
- Solicitud de contacto (candidato)

## 🚢 Deploy a Producción

### Vercel + Neon

1. **Conectar repositorio a Vercel**

2. **Configurar variables de entorno** en Vercel Dashboard

3. **Configurar base de datos en Neon**:
   - Crear proyecto en [neon.tech](https://neon.tech)
   - Copiar `DATABASE_URL`
   - Ejecutar migraciones:

```bash
pnpm prisma migrate deploy
```

4. **Build automático**: Vercel ejecutará `pnpm build`

5. **Verificar OAuth callbacks**:
   - Google: `https://tu-dominio.vercel.app/api/auth/callback/google`
   - Microsoft: `https://tu-dominio.vercel.app/api/auth/callback/microsoft`
   - Facebook: `https://tu-dominio.vercel.app/api/auth/callback/facebook`
   - GitHub: `https://tu-dominio.vercel.app/api/auth/callback/github` (deshabilitado en UI)

## 🧪 Testing

### E2E con Playwright

```bash
# Instalar Playwright
pnpm playwright install

# Ejecutar tests
pnpm test:e2e
```

**Smoke tests incluidos:**

- Alta de empleo (empresa)
- Postulación (candidato)
- Login empresa

## 📝 Scripts Disponibles

```bash
pnpm dev          # Desarrollo con Turbopack
pnpm build        # Build para producción
pnpm start        # Servidor producción
pnpm lint         # ESLint
pnpm format       # Prettier
pnpm db:push      # Push schema sin migración
pnpm db:migrate   # Crear migración
pnpm db:seed      # Seed con datos de prueba
pnpm db:studio    # Prisma Studio (GUI)
pnpm test:e2e     # Playwright
```

## 🔐 Seguridad

- Server Actions con validación de rol
- Usuario solo puede editar sus recursos
- Sanitización de inputs (Zod)
- Sin hooks que salteen (--no-verify)
- ENV secrets nunca en código

## 🌍 Provincias de Argentina

Lista completa en `lib/constants.ts`:

- CABA, Buenos Aires, Córdoba, Santa Fe, Mendoza, Tucumán, Entre Ríos, Salta, Misiones, Chaco, Chubut, Corrientes, Formosa, Jujuy, La Pampa, La Rioja, Neuquén, Río Negro, San Juan, San Luis, Santa Cruz, Santiago del Estero, Tierra del Fuego

## 📖 Documentación Adicional

- [Better-Auth Docs](https://better-auth.com)
- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js 16 Docs](https://nextjs.org/docs)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Contribuir

1. Fork el proyecto
2. Crear branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Add: nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📄 Licencia

MIT © 2025 JubiJobs

---

**Próximos pasos sugeridos:**

- Implementar autenticación con DNI digital (Argentina)
- Agregar passwordless (magic links)
- Expandir a otros países de LatAm
- Sistema de mensajería interna
- Verificación de empresas
- Reviews de empresas por candidatos
