import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PROVINCIAS_AR = [
  "CABA",
  "Buenos Aires",
  "Córdoba",
  "Santa Fe",
  "Mendoza",
  "Tucumán",
  "Entre Ríos",
  "Salta",
  "Misiones",
  "Chaco",
  "Chubut",
  "Corrientes",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Neuquén",
  "Río Negro",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santiago del Estero",
  "Tierra del Fuego",
];

async function main() {
  console.log("🌱 Iniciando seed...");

  // Limpiar datos existentes
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();

  // Crear 3 empresas demo
  const empresa1Owner = await prisma.user.create({
    data: {
      email: "contacto@supermercadosur.com.ar",
      name: "María González",
      role: "COMPANY",
    },
  });

  const empresa1 = await prisma.company.create({
    data: {
      ownerId: empresa1Owner.id,
      name: "Supermercado Sur",
      logoUrl: "https://via.placeholder.com/200x200?text=Super+Sur",
      website: "https://supermercadosur.com.ar",
      about:
        "Cadena de supermercados con más de 30 años en el mercado argentino. Valoramos la experiencia y dedicación de nuestros colaboradores.",
      location: "CABA",
      isVerified: true,
    },
  });

  const empresa2Owner = await prisma.user.create({
    data: {
      email: "rrhh@consultoriaplus.com.ar",
      name: "Carlos Rodríguez",
      role: "COMPANY",
    },
  });

  const empresa2 = await prisma.company.create({
    data: {
      ownerId: empresa2Owner.id,
      name: "Consultoría Plus",
      logoUrl: "https://via.placeholder.com/200x200?text=Consultoría",
      website: "https://consultoriaplus.com.ar",
      about:
        "Empresa de consultoría especializada en gestión administrativa. Buscamos personas con experiencia para sumarse a nuestro equipo.",
      location: "Córdoba",
      isVerified: true,
    },
  });

  const empresa3Owner = await prisma.user.create({
    data: {
      email: "info@bibliotecacentral.gob.ar",
      name: "Ana Martínez",
      role: "COMPANY",
    },
  });

  const empresa3 = await prisma.company.create({
    data: {
      ownerId: empresa3Owner.id,
      name: "Biblioteca Central",
      logoUrl: "https://via.placeholder.com/200x200?text=Biblioteca",
      website: "https://bibliotecacentral.gob.ar",
      about:
        "Biblioteca pública municipal. Valoramos la vocación de servicio y el amor por la cultura.",
      location: "Santa Fe",
      isVerified: true,
    },
  });

  console.log("✅ Empresas creadas");

  // Crear 6 empleos de ejemplo
  const job1 = await prisma.job.create({
    data: {
      companyId: empresa1.id,
      title: "Administrativo/a part-time",
      description:
        "Buscamos una persona para tareas administrativas generales: archivo, atención telefónica, gestión de documentación. Horario flexible de 4 horas diarias. Ideal para personas jubiladas que quieran mantenerse activas.",
      province: "CABA",
      city: "Palermo",
      schedule: "PART_TIME",
      modality: "PRESENCIAL",
      salaryArsMin: 250000,
      salaryArsMax: 350000,
      status: "PUBLISHED",
      moderationStatus: "APPROVED",
      portals: ["JUBI"],
      tags: ["Administración", "Archivo", "Atención telefónica"],
    },
  });

  const job2 = await prisma.job.create({
    data: {
      companyId: empresa1.id,
      title: "Atención al cliente - Fines de semana",
      description:
        "Necesitamos una persona para atención al cliente en nuestras sucursales los fines de semana. Horario: sábados y domingos de 9 a 14hs. Valoramos la experiencia en trato con público.",
      province: "Buenos Aires",
      city: "La Plata",
      schedule: "POR_DIA",
      modality: "PRESENCIAL",
      salaryArsMin: 180000,
      salaryArsMax: 220000,
      status: "PUBLISHED",
      moderationStatus: "APPROVED",
      portals: ["JUBI"],
      tags: ["Atención al cliente", "Fines de semana"],
    },
  });

  const job3 = await prisma.job.create({
    data: {
      companyId: empresa2.id,
      title: "Recepcionista - Jornada flexible",
      description:
        "Buscamos recepcionista para nuestra oficina. Jornada flexible, se puede coordinar horario según disponibilidad. Tareas: recepción de visitas, gestión de llamadas, agenda.",
      province: "Córdoba",
      city: "Córdoba Capital",
      schedule: "FLEX",
      modality: "PRESENCIAL",
      salaryArsMin: 280000,
      salaryArsMax: 380000,
      status: "PUBLISHED",
      moderationStatus: "APPROVED",
      portals: ["JUBI", "INCLU"],
      supportsFlexHours: true,
      hasAccessibleSite: true,
      accessibilityNotes:
        "La oficina está en planta baja, con acceso sin escalones y baño adaptado. El horario se coordina según tus necesidades.",
      tags: ["Recepción", "Atención al público", "Administración"],
    },
  });

  const job4 = await prisma.job.create({
    data: {
      companyId: empresa2.id,
      title: "Control de stock - Remoto",
      description:
        "Oportunidad de trabajo remoto. Buscamos persona para control y registro de stock mediante sistema digital. Se requiere manejo básico de computadora. Capacitación incluida.",
      province: "Mendoza",
      city: null,
      schedule: "PART_TIME",
      modality: "REMOTO",
      salaryArsMin: 200000,
      salaryArsMax: 280000,
      status: "PUBLISHED",
      moderationStatus: "APPROVED",
      portals: ["JUBI", "INCLU"],
      isRemoteFriendly: true,
      supportsFlexHours: true,
      accessibilityNotes:
        "Trabajo íntegramente remoto. Entregamos el equipo y la conexión.",
      tags: ["Control de stock", "Remoto", "Digital"],
    },
  });

  const job5 = await prisma.job.create({
    data: {
      companyId: empresa3.id,
      title: "Acompañante de sala - Biblioteca",
      description:
        "Buscamos persona para acompañar a los usuarios en la sala de lectura, orientar sobre el uso de recursos y mantener el orden. Ambiente tranquilo y agradable. Horario: lunes a viernes de 14 a 18hs.",
      province: "Santa Fe",
      city: "Rosario",
      schedule: "PART_TIME",
      modality: "PRESENCIAL",
      salaryArsMin: 220000,
      salaryArsMax: 300000,
      status: "PUBLISHED",
      moderationStatus: "APPROVED",
      portals: ["INCLU"],
      hasAccessibleSite: true,
      isRemoteFriendly: true,
      accessibilityNotes:
        "Edificio con ascensor y rampa. Contamos con lector de pantalla instalado y el equipo maneja lengua de señas básica.",
      tags: ["Atención al público", "Cultura", "Educación"],
    },
  });

  const job6 = await prisma.job.create({
    data: {
      companyId: empresa3.id,
      title: "Mantenimiento liviano - Modalidad híbrida",
      description:
        "Buscamos persona para tareas de mantenimiento liviano: revisión de instalaciones, cambio de luminarias, tareas de jardinería menores. Modalidad híbrida: 2 días presencial, 3 días disponibilidad remota para coordinación.",
      province: "Entre Ríos",
      city: "Paraná",
      schedule: "FLEX",
      modality: "HIBRIDO",
      salaryArsMin: 300000,
      salaryArsMax: 400000,
      status: "PUBLISHED",
      moderationStatus: "APPROVED",
      portals: ["INCLU"],
      supportsFlexHours: true,
      accessibilityNotes:
        "Horarios totalmente flexibles, compatibles con tratamientos médicos.",
      tags: ["Mantenimiento", "Jardinería", "Servicios"],
    },
  });

  console.log("✅ Empleos creados");

  // Crear 3 candidatos demo
  const candidato1 = await prisma.user.create({
    data: {
      email: "juan.perez@email.com",
      name: "Juan Pérez",
      role: "CANDIDATE",
      phoneNumber: "11-5555-1234",
      location: "CABA",
      birthYear: 1958,
      did: "Trabajé 35 años en el sector bancario, en el área de atención al cliente y administración de documentos.",
      canDo:
        "Manejo muy bien el trato con personas, soy organizado con papeles y tengo conocimientos de computación básica.",
      wantToDo:
        "Me gustaría trabajar en algo que me permita seguir en contacto con gente, part-time, para mantenerme activo.",
      isDisabled: false,
    },
  });

  const candidato2 = await prisma.user.create({
    data: {
      email: "maria.lopez@email.com",
      name: "María López",
      role: "CANDIDATE",
      phoneNumber: "351-666-5678",
      location: "Córdoba",
      birthYear: 1960,
      did: "Fui secretaria en una empresa de 20 años. Atendía teléfonos, organizaba agendas y recibía visitas.",
      canDo:
        "Sé manejar Office, soy muy ordenada y me gusta la atención al público.",
      wantToDo:
        "Busco algo tranquilo, con horario flexible, para complementar mi jubilación.",
      isDisabled: false,
    },
  });

  const candidato3 = await prisma.user.create({
    data: {
      email: "roberto.gomez@email.com",
      name: "Roberto Gómez",
      role: "CANDIDATE",
      phoneNumber: "341-777-9012",
      location: "Santa Fe",
      birthYear: 1955,
      did: "Trabajé en mantenimiento de edificios y espacios públicos durante 30 años.",
      canDo:
        "Manejo herramientas, sé de electricidad básica, jardinería y pintura.",
      wantToDo:
        "Me gustaría seguir haciendo lo que sé, pero con menos carga horaria.",
      isDisabled: true,
      disabilityType: "MOTRIZ",
      accessibilityNeeds:
        "Necesito rampas de acceso y baños adaptados. Me muevo con bastón.",
    },
  });

  console.log("✅ Candidatos creados");

  // Crear algunas postulaciones
  await prisma.application.create({
    data: {
      jobId: job1.id,
      userId: candidato1.id,
      did: candidato1.did!,
      canDo: candidato1.canDo!,
      wantToDo: candidato1.wantToDo!,
      status: "SUBMITTED",
    },
  });

  await prisma.application.create({
    data: {
      jobId: job3.id,
      userId: candidato2.id,
      did: candidato2.did!,
      canDo: candidato2.canDo!,
      wantToDo: candidato2.wantToDo!,
      status: "REVIEWED",
    },
  });

  await prisma.application.create({
    data: {
      jobId: job6.id,
      userId: candidato3.id,
      did: candidato3.did!,
      canDo: candidato3.canDo!,
      wantToDo: candidato3.wantToDo!,
      status: "CONTACTED",
    },
  });

  console.log("✅ Postulaciones creadas");
  console.log("🎉 Seed completado exitosamente!");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
