// Corre con `pnpm test:unit`. Node 24 carga el .ts quitando los tipos.
import { test } from "node:test";
import assert from "node:assert/strict";
import { decideCountry } from "../../lib/country.ts";

test("permite Argentina y guarda el código", () => {
  assert.deepEqual(decideCountry("AR"), { allowed: true, country: "AR" });
  assert.deepEqual(decideCountry(" ar "), { allowed: true, country: "AR" });
});

test("rechaza otros países pero guarda el código", () => {
  assert.deepEqual(decideCountry("UY"), { allowed: false, country: "UY" });
  assert.deepEqual(decideCountry("US"), { allowed: false, country: "US" });
});

test("sin header (dev local) permite y no guarda país", () => {
  assert.deepEqual(decideCountry(null), { allowed: true, country: null });
  assert.deepEqual(decideCountry(undefined), { allowed: true, country: null });
  assert.deepEqual(decideCountry(""), { allowed: true, country: null });
});

test("un header raro no se guarda ni deja pasar", () => {
  assert.deepEqual(decideCountry("ARG"), { allowed: false, country: null });
  assert.deepEqual(decideCountry("<x>"), { allowed: false, country: null });
});
