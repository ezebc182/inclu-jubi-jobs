// Corre con `pnpm test:unit`. Node 24 carga el .ts quitando los tipos.
import { test } from "node:test";
import assert from "node:assert/strict";
import { callPreferenceSchema, statusesBefore } from "../../lib/postulacion.ts";

test("el estado solo avanza: enviada → vista → contactado", () => {
  assert.deepEqual(statusesBefore("SUBMITTED"), []);
  assert.deepEqual(statusesBefore("REVIEWED"), ["SUBMITTED"]);
  assert.deepEqual(statusesBefore("CONTACTED"), ["SUBMITTED", "REVIEWED"]);
});

test("una postulación contactada no vuelve a vista", () => {
  assert.equal(statusesBefore("REVIEWED").includes("CONTACTED"), false);
  assert.equal(statusesBefore("REVIEWED").includes("REVIEWED"), false);
});

test("acepta teléfonos AR y los normaliza", () => {
  const ok = (phone) =>
    callPreferenceSchema.parse({ phone, slot: "MORNING" }).phone;
  assert.equal(ok("11 4567-8901"), "1145678901");
  assert.equal(ok("(0351) 456-7890"), "03514567890");
  assert.equal(ok("+54 9 11 4567 8901"), "+5491145678901");
});

test("rechaza teléfonos cortos, largos o con letras", () => {
  for (const phone of [
    "",
    "4567-8901",
    "11 4567 8901 12345",
    "11 abc 45678901",
  ]) {
    const r = callPreferenceSchema.safeParse({ phone, slot: "ANYTIME" });
    assert.equal(r.success, false, phone);
  }
});

test("la franja tiene que ser una de las ofrecidas", () => {
  for (const slot of ["MORNING", "AFTERNOON", "ANYTIME"]) {
    assert.equal(
      callPreferenceSchema.safeParse({ phone: "1145678901", slot }).success,
      true
    );
  }
  for (const slot of ["NIGHT", "", undefined]) {
    assert.equal(
      callPreferenceSchema.safeParse({ phone: "1145678901", slot }).success,
      false
    );
  }
});
