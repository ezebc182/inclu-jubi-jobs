// Corre con `pnpm test:unit`. Node 24 carga el .ts quitando los tipos.
import { test } from "node:test";
import assert from "node:assert/strict";
import { signLeadId, verifyLeadToken } from "../../lib/unsubscribe.ts";

const SECRET = "s".repeat(32);

test("una firma válida verifica", () => {
  const token = signLeadId("lead_1", SECRET);
  assert.equal(verifyLeadToken("lead_1", token, SECRET), true);
});

test("no sirve para otro lead, con otro secreto ni alterada", () => {
  const token = signLeadId("lead_1", SECRET);
  assert.equal(verifyLeadToken("lead_2", token, SECRET), false);
  assert.equal(verifyLeadToken("lead_1", token, "x".repeat(32)), false);
  assert.equal(verifyLeadToken("lead_1", token.slice(1), SECRET), false);
  assert.equal(verifyLeadToken("lead_1", "", SECRET), false);
});
