import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const stylesheet = readFileSync(resolve(process.cwd(), "app/globals.css"), "utf8");
const markupPanel = readFileSync(resolve(process.cwd(), "components/markup-panel.tsx"), "utf8");
const markupCalculator = readFileSync(resolve(process.cwd(), "components/markup-calculator.tsx"), "utf8");

describe("Markup Factor panel layout", () => {
  it("keeps notebook panels bounded and shares theme colors across calculator and rates", () => {
    expect(stylesheet).toContain(".site-shell { height:100dvh;");
    expect(stylesheet).toContain(".markup-panel { order:2; position:static;");
    expect(stylesheet).toContain(".markup-condition-layout");
    expect(stylesheet).toContain(".markup-calculator");
    expect(stylesheet).toContain(":root[data-theme=\"dark\"]");
    expect(stylesheet).toContain(".rate-value { color:var(--ink); font-size:17px;");
    expect(stylesheet).toContain(".rate-card-grid strong { margin-top:4px; color:var(--ink); font-size:16px;");
    expect(stylesheet).toContain(".professional-cell,.personnel-role-cell { color:var(--muted); font-size:12px;");
    expect(markupPanel).toContain("faPercent");
    expect(markupPanel).toContain('className="panel-title-icon"');
    expect(markupPanel).toContain("factor-rules-tooltip");
    expect(markupPanel).toContain("factor.factor_label");
    expect(markupPanel).toContain("factor.factor_value");
    expect(stylesheet).toContain(".factor-rules-tooltip");
    expect(markupCalculator).toContain("faCalculator");
    expect(markupCalculator).toContain('className="calculator-title-icon"');
  });
});
