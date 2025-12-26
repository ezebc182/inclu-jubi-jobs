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
      <div className="flex gap-2 rounded-lg bg-gray-100 p-1 transition-colors dark:bg-gray-700">
        <button
          onClick={() => setMethod("oauth")}
          className={`flex-1 rounded-md px-4 py-3 text-base font-semibold transition-all ${
            method === "oauth"
              ? "bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-gray-100"
              : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
        >
          Google / Facebook / Microsoft
        </button>
        <button
          onClick={() => setMethod("phone")}
          className={`flex-1 rounded-md px-4 py-3 text-base font-semibold transition-all ${
            method === "phone"
              ? "bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-gray-100"
              : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
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
