import { NextResponse } from "next/server";

export async function GET() {
  // Verificar si la solicitud proviene de un origen autorizado
  // En una aplicación real, deberías implementar más validaciones aquí

  // Usamos GOOGLE_MAPS_API_KEY (sin NEXT_PUBLIC_) para mantenerla segura en el servidor
  // y solo devolvemos un token de acceso temporal o la clave con restricciones
  if (!process.env.GOOGLE_MAPS_API_KEY) {
    return NextResponse.json(
      { error: "API key no configurada" },
      { status: 500 }
    );
  }

  // Devolvemos un token de acceso en lugar de la clave directa
  // En una implementación real, podrías generar un token JWT con tiempo limitado
  return NextResponse.json({
    token: "maps-access-token", // Token de ejemplo
    hasKey: true,
  });
}
