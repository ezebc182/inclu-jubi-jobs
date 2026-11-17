// Corre con `pnpm test:unit`. Node 24 carga el .ts quitando los tipos.
import { test } from "node:test";
import assert from "node:assert/strict";
import { jobPostingLd, serializeJsonLd } from "../../lib/job-posting.ts";

const base = {
  title: "Cajero",
  description: "Atención al público",
  createdAt: new Date("2026-01-01T00:00:00Z"),
  moderatedAt: new Date("2026-01-02T00:00:00Z"),
  expiresAt: new Date("2026-03-03T00:00:00Z"),
  schedule: "POR_DIA",
  modality: "REMOTO",
  province: "Córdoba",
  city: null,
  company: { name: "ACME", website: null, logoUrl: null },
};

test("arma el JobPosting con vencimiento, provincia y remoto", () => {
  const ld = jobPostingLd(base);
  assert.equal(ld.datePosted, "2026-01-02T00:00:00.000Z");
  assert.equal(ld.validThrough, "2026-03-03T00:00:00.000Z");
  assert.equal(ld.employmentType, "PER_DIEM");
  assert.equal(ld.jobLocation.address.addressRegion, "Córdoba");
  assert.equal(ld.jobLocation.address.addressCountry, "AR");
  assert.equal(ld.jobLocationType, "TELECOMMUTE");
});

test("presencial y sin vencimiento no inventa campos", () => {
  const ld = jobPostingLd({ ...base, modality: "PRESENCIAL", expiresAt: null });
  assert.equal("validThrough" in ld, false);
  assert.equal("jobLocationType" in ld, false);
});

test("el JSON no puede cerrar el <script>", () => {
  const out = serializeJsonLd({
    title: "</script><img src=x onerror=alert(1)>",
  });
  assert.equal(out.includes("<"), false);
  assert.deepEqual(JSON.parse(out), {
    title: "</script><img src=x onerror=alert(1)>",
  });
});
