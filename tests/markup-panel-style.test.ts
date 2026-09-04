import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const stylesheet = readFileSync(resolve(process.cwd(), "app/globals.css"), "utf8");
const markupPanel = readFileSync(resolve(process.cwd(), "components/markup-panel.tsx"), "utf8");

describe("Markup Factor panel layout", () => {
  it("sticks beside long tables and returns to normal flow on smaller screens", () => {
    expect(stylesheet).toMatch(/\.markup-panel\s*\{[^}]*position:\s*sticky/);
    expect(stylesheet).toContain(".markup-panel { order:2; position:static; }");
    expect(stylesheet).toContain(".markup-condition-layout");
    expect(stylesheet).toContain(".markup-calculator");
    expect(stylesheet).toContain(":root[data-theme=\"dark\"] .markup-calculator");
    expect(stylesheet).toContain(":root[data-theme=\"dark\"] .rate-table .rate-value");
    expect(stylesheet).toContain(":root[data-theme=\"dark\"] .derived-role");
    expect(stylesheet).toContain(":root[data-theme=\"dark\"] .factor-result");
    expect(stylesheet).toContain(".rate-value { color:var(--teal-deep); font-size:17px;");
    expect(stylesheet).toContain(".rate-card-grid strong { margin-top:4px; color:var(--teal); font-size:16px;");
    expect(stylesheet).toContain(".personnel-role-cell { color:var(--teal); font-size:12px;");
    expect(markupPanel).toContain("faPercent");
    expect(markupPanel).toContain('className="panel-title-icon"');
    expect(markupPanel).toContain("factor-rules-tooltip");
    expect(markupPanel).toContain("factor.factor_label");
    expect(markupPanel).toContain("factor.factor_value");
    expect(stylesheet).toContain(".factor-rules-tooltip");
  });
});
