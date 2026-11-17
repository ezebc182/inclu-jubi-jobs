// Corre con `pnpm test:unit` (node:test, sin dependencias).
// El SW es un script clásico sin exports: lo evaluamos en un contexto aislado
// con un `self` mínimo y probamos sus funciones de decisión.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(
  new URL("../../public/sw.js", import.meta.url),
  "utf8"
);
const context = {
  self: { addEventListener() {}, location: { origin: "https://x" } },
};
vm.runInNewContext(source, context);
const { isPublicPage, isCacheableResponse } = context;

test("cachea solo páginas públicas", () => {
  for (const path of [
    "/",
    "/empleos",
    "/empleos/abc123",
    "/privacidad",
    "/offline",
  ]) {
    assert.equal(isPublicPage(path), true, path);
  }
  for (const path of [
    "/admin",
    "/admin/usuarios",
    "/empresa",
    "/empresas-falsas",
    "/postulaciones",
    "/onboarding/candidato",
    "/ingresar",
    "/empleosx",
  ]) {
    assert.equal(isPublicPage(path), false, path);
  }
});

test("no cachea respuestas no-store ni con error", () => {
  const res = (status, cacheControl) => ({
    ok: status >= 200 && status < 300,
    headers: new Headers(cacheControl ? { "Cache-Control": cacheControl } : {}),
  });
  assert.equal(isCacheableResponse(res(200)), true);
  assert.equal(isCacheableResponse(res(200, "public, max-age=60")), true);
  assert.equal(
    isCacheableResponse(res(200, "private, no-cache, no-store, max-age=0")),
    false
  );
  assert.equal(isCacheableResponse(res(500)), false);
  assert.equal(isCacheableResponse(undefined), false);
});
