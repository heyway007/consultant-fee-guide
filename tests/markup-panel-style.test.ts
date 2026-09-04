import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const stylesheet = readFileSync(resolve(process.cwd(), "app/globals.css"), "utf8");

describe("Markup Factor panel layout", () => {
  it("sticks beside long tables and returns to normal flow on smaller screens", () => {
    expect(stylesheet).toMatch(/\.markup-panel\s*\{[^}]*position:\s*sticky/);
    expect(stylesheet).toContain(".markup-panel { order:2; position:static; }");
    expect(stylesheet).toContain(".markup-condition-layout");
    expect(stylesheet).toContain(".markup-calculator");
    expect(stylesheet).toContain(":root[data-theme=\"dark\"] .markup-calculator");
    expect(stylesheet).toContain(":root[data-theme=\"dark\"] .rate-table .rate-value");
  });
});
