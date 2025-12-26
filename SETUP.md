# 🚀 Guía de Setup - JubiJobs

## ✅ Archivos Creados

Se han creado los siguientes archivos fundamentales:

### Configuración
- ✅ `package.json` - Dependencias y scripts
- ✅ `tsconfig.json` - Configuración TypeScript
- ✅ `tailwind.config.ts` - Estilos Tailwind
- ✅ `next.config.ts` - Configuración Next.js
- ✅ `.env.example` - Variables de entorno de ejemplo
- ✅ `.gitignore` - Archivos ignorados por Git

### Base de Datos y Auth
- ✅ `prisma/schema.prisma` - Modelos de datos
- ✅ `prisma/seed.ts` - Datos de ejemplo
- ✅ `lib/db.ts` - Cliente Prisma
- ✅ `lib/auth.ts` - Configuración Better-Auth (servidor)
- ✅ `lib/auth-client.ts` - Cliente auth (navegador)
- ✅ `lib/email.ts` - Sistema de emails
- ✅ `lib/constants.ts` - Constantes (provincias AR, etc.)
- ✅ `lib/validations.ts` - Esquemas Zod

### Componentes UI
- ✅ `components/ui/BigCTAButton.tsx`
- ✅ `components/ui/SectionTitle.tsx`
- ✅ `components/ui/EmptyState.tsx`
- ✅ `components/forms/LargeToggleRole.tsx`
- ✅ `components/forms/ProvinceSelect.tsx`
- ✅ `components/forms/ThreeQuestionsForm.tsx`
- ✅ `components/jobs/JobCard.tsx`
- ✅ `components/jobs/JobFilters.tsx`
- ✅ `components/applications/ApplicationCard.tsx`
- ✅ `components/layout/Header.tsx`
- ✅ `components/layout/Footer.tsx`

### Páginas Principales
- ✅ `app/layout.tsx` - Layout raíz
- ✅ `app/page.tsx` - Home
- ✅ `app/globals.css` - Estilos globales
- ✅ `app/api/auth/[...all]/route.ts` - API Better-Auth

### Documentación
- ✅ `README.md` - Documentación completa del proyecto
- ✅ `SETUP.md` - Esta guía

### Server Actions (base)
- ✅ `app/actions/jobs.ts` - Acciones de empleos
- ✅ `app/actions/applications.ts` - Acciones de postulaciones

## 📝 Archivos Restantes a Crear

Para completar el MVP, necesitás crear los siguientes archivos:

### 1. Páginas de Empleos

**`app/empleos/page.tsx`** - Listado de empleos

```tsx
import { prisma } from "@/lib/db";
import { JobCard } from "@/components/jobs/JobCard";
import { JobFilters } from "@/components/jobs/JobFilters";
import { EmptyState } from "@/components/ui/EmptyState";

export default async function EmpleosPage({
  searchParams,
}: {
  searchParams: { provincia?: string; modalidad?: string; jornada?: string; q?: string };
}) {
  const where: any = { status: "PUBLISHED" };

  if (searchParams.provincia) where.province = searchParams.provincia;
  if (searchParams.modalidad) where.modality = searchParams.modalidad;
  if (searchParams.jornada) where.schedule = searchParams.jornada;
  if (searchParams.q) {
    where.OR = [
      { title: { contains: searchParams.q, mode: "insensitive" } },
      { description: { contains: searchParams.q, mode: "insensitive" } },
    ];
  }

  const jobs = await prisma.job.findMany({
    where,
    include: { company: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold text-gray-900">Empleos disponibles</h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <JobFilters />
        </aside>
        <main className="lg:col-span-3">
          {jobs.length === 0 ? (
            <EmptyState
              title="No se encontraron empleos"
              description="Probá ajustando los filtros o buscando otras palabras clave."
            />
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  id={job.id}
                  title={job.title}
                  company={job.company.name}
                  province={job.province}
                  city={job.city}
                  modality={job.modality}
                  schedule={job.schedule}
                  salaryArsMin={job.salaryArsMin}
                  salaryArsMax={job.salaryArsMax}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
```

**`app/empleos/[id]/page.tsx`** - Detalle de empleo

```tsx
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { formatCurrency, formatDate } from "@/lib/constants";
import { notFound } from "next/navigation";
import { ThreeQuestionsForm } from "@/components/forms/ThreeQuestionsForm";
import { submitApplication } from "@/app/actions/applications";

export default async function EmpleoDetailPage({ params }: { params: { id: string } }) {
  const job = await prisma.job.findUnique({
    where: { id: params.id },
    include: { company: true },
  });

  if (!job) notFound();

  const session = await auth.api.getSession({ headers: await headers() });
  const isCandidate = session?.user.role === "CANDIDATE";

  let hasApplied = false;
  let user: any = null;

  if (isCandidate) {
    user = await prisma.user.findUnique({ where: { id: session.user.id } });
    const application = await prisma.application.findUnique({
      where: {
        jobId_userId: {
          jobId: params.id,
          userId: session.user.id,
        },
      },
    });
    hasApplied = !!application;
  }

  const handleSubmit = async (answers: any) => {
    "use server";
    await submitApplication(params.id, answers);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <article>
        <header className="mb-8">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">{job.title}</h1>
          <div className="flex flex-col gap-3 text-lg text-gray-700">
            <div><strong>Empresa:</strong> {job.company.name}</div>
            <div><strong>Ubicación:</strong> {job.city ? \`\${job.city}, \${job.province}\` : job.province}</div>
            <div><strong>Modalidad:</strong> {job.modality}</div>
            <div><strong>Jornada:</strong> {job.schedule}</div>
            {job.salaryArsMin && job.salaryArsMax && (
              <div>
                <strong>Salario:</strong> {formatCurrency(job.salaryArsMin)} - {formatCurrency(job.salaryArsMax)}
              </div>
            )}
            <div className="text-base text-gray-600">Publicado el {formatDate(job.createdAt)}</div>
          </div>
        </header>

        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Descripción</h2>
          <div className="whitespace-pre-wrap text-lg text-gray-700">{job.description}</div>
        </section>

        {isCandidate && !hasApplied && (
          <section className="rounded-lg border-2 border-primary-300 bg-primary-50 p-8">
            <h2 className="mb-6 text-3xl font-bold text-gray-900">Postularme (3 preguntas)</h2>
            <ThreeQuestionsForm
              initialValues={{
                did: user?.did || "",
                canDo: user?.canDo || "",
                wantToDo: user?.wantToDo || "",
              }}
              onSubmit={handleSubmit}
            />
          </section>
        )}

        {hasApplied && (
          <div className="rounded-lg border-2 border-green-300 bg-green-50 p-6 text-center">
            <p className="text-xl font-bold text-green-800">Ya te postulaste a este empleo</p>
            <p className="mt-2 text-lg text-green-700">
              Revisá el estado en <a href="/postulaciones" className="underline">Mis postulaciones</a>
            </p>
          </div>
        )}

        {!session && (
          <div className="rounded-lg border-2 border-primary-300 bg-primary-50 p-6 text-center">
            <p className="mb-4 text-xl font-bold text-gray-900">Para postularte, ingresá primero</p>
            <a
              href="/api/auth/signin"
              className="inline-block rounded-lg bg-primary-600 px-8 py-4 text-lg font-bold text-white hover:bg-primary-700"
            >
              Ingresar
            </a>
          </div>
        )}
      </article>
    </div>
  );
}
```

### 2. Dashboard Empresa

**`app/empresa/page.tsx`**

```tsx
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
// Implementar tabs con Radix UI para:
// - Mis empleos (con botones para pausar/cerrar)
// - Postulaciones recibidas
// - Perfil de empresa
```

### 3. Postulaciones Candidato

**`app/postulaciones/page.tsx`**

```tsx
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ApplicationCard } from "@/components/applications/ApplicationCard";
// Listar todas las postulaciones del candidato
```

### 4. Páginas Estáticas

- `app/empresas/page.tsx` - Landing para empresas
- `app/discapacidad/page.tsx` - Página de inclusión
- `app/como-funciona/page.tsx`
- `app/accesibilidad/page.tsx`
- `app/privacidad/page.tsx`
- `app/terminos/page.tsx`

## 🚀 Pasos Rápidos de Setup

### 1. Instalar dependencias

```bash
pnpm install
```

### 2. Configurar entorno

```bash
cp .env.example .env
```

Editá `.env` con tus credenciales.

### 3. Setup de base de datos

```bash
# Generar cliente Prisma
pnpm prisma generate

# Crear y aplicar migración inicial
pnpm db:migrate

# Cargar datos de ejemplo
pnpm db:seed
```

### 4. Ejecutar en desarrollo

```bash
pnpm dev
```

## 🎯 Próximos Pasos Recomendados

1. **Crear las páginas faltantes** (empleos, empresa, postulaciones)
2. **Agregar validaciones** en todos los forms
3. **Implementar tests E2E** con Playwright
4. **Optimizar imágenes** con next/image
5. **Agregar middleware** para proteger rutas privadas
6. **Implementar rate limiting** en Server Actions
7. **Deploy a Vercel** + Neon

## 🐛 Troubleshooting

**Error: "Export GET doesn't exist in target module"**
- Verificá que `app/api/auth/[...all]/route.ts` exista y esté correctamente importado

**Error de Prisma Client**
- Ejecutá `pnpm prisma generate` después de cada cambio en schema

**OAuth no funciona**
- Verificá que las URLs de callback estén correctamente configuradas en los providers

## 📚 Recursos Adicionales

- [Next.js 15 Docs](https://nextjs.org/docs)
- [Better-Auth Docs](https://better-auth.com)
- [Prisma Docs](https://www.prisma.io/docs)
- [Radix UI](https://www.radix-ui.com/)

---

¿Preguntas? Revisá el [README.md](./README.md) completo.
