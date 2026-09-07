"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ThemeDebugger() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evitar problemas de hidratación
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Card className="mx-auto mt-4 w-full max-w-md">
      <CardHeader>
        <CardTitle>Depurador de Tema</CardTitle>
        <CardDescription>
          Información sobre el estado actual del tema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p>
            <strong>Tema actual:</strong> {theme}
          </p>
          <p>
            <strong>Tema del sistema:</strong> {systemTheme}
          </p>
          <p>
            <strong>Clase en HTML:</strong>{" "}
            {document.documentElement.classList.contains("dark")
              ? "dark"
              : "light"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setTheme("light")}>Forzar Claro</Button>
          <Button onClick={() => setTheme("dark")}>Forzar Oscuro</Button>
          <Button onClick={() => setTheme("system")}>Usar Sistema</Button>
        </div>
        <div>
          <Button
            onClick={() => {
              localStorage.removeItem("theme");
              window.location.reload();
            }}
            variant="destructive"
          >
            Reiniciar Tema
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
