"use client";

import { useState } from "react";
import { SignInButtons } from "./SignInButtons";
import { PhoneLogin } from "./PhoneLogin";

type LoginMethod = "oauth" | "phone";

export function LoginOptions() {
  const [method, setMethod] = useState<LoginMethod>("oauth");

  return (
    <div className="space-y-6">
      {/* Tabs para alternar entre métodos */}
      <div className="flex gap-2 rounded-lg bg-paper p-1 transition-colors">
        <button
          onClick={() => setMethod("oauth")}
          className={`flex-1 rounded-md px-4 py-3 text-base font-semibold transition-all ${
            method === "oauth"
              ? "bg-white text-ink shadow-sm"
              : "text-ink-soft hover:text-ink"
          }`}
        >
          Google / Facebook / Microsoft
        </button>
        <button
          onClick={() => setMethod("phone")}
          className={`flex-1 rounded-md px-4 py-3 text-base font-semibold transition-all ${
            method === "phone"
              ? "bg-white text-ink shadow-sm"
              : "text-ink-soft hover:text-ink"
          }`}
        >
          📱 Teléfono
        </button>
      </div>

      {/* Contenido según el método seleccionado */}
      {method === "oauth" ? <SignInButtons /> : <PhoneLogin />}
    </div>
  );
}
