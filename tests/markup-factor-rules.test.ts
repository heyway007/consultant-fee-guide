import { describe, expect, it } from "vitest";
import { markupFactors } from "@/lib/w16-data";
import { findMarkupFactor } from "@/lib/markup-factors";
import type { MarkupFactorSelection } from "@/lib/markup-factors";

const rules = markupFactors as unknown as Array<Record<string, unknown>>;

describe("Markup Factor rules", () => {
  it("contains the eight connected cases from the W16 guidance", () => {
    expect(rules).toHaveLength(8);
    expect(rules.map((rule) => rule.organization_type)).toEqual([
      "company-association",
      "company-association",
      "company-association",
      "company-association",
      "company-association",
      "government",
      "government",
      "independent",
    ]);
  });

  it("matches company evidence to the main staff factor and keeps assistant independent of evidence count", () => {
    const companyMainRules = rules.filter((rule) => rule.organization_type === "company-association" && rule.personnel_role === "main");
    const companyAssistantRule = rules.find((rule) => rule.organization_type === "company-association" && rule.personnel_role === "assistant");

    expect(companyMainRules.map((rule) => [rule.evidence_count, rule.factor_value])).toEqual([
      ["3", 2.64],
      ["2", 2.555],
      ["1", 2.53],
      ["0", 2.475],
    ]);
    expect(companyAssistantRule?.factor_value).toBe(2.255);
    expect(companyAssistantRule?.evidence_count).toBe("any");
  });

  it("keeps the government and independent factor values separate from company evidence", () => {
    expect(rules.filter((rule) => rule.organization_type === "government").map((rule) => [rule.personnel_role, rule.factor_value])).toEqual([
      ["main", 1.76],
      ["assistant", 1.456],
    ]);
    expect(rules.find((rule) => rule.organization_type === "independent")?.factor_value).toBe(1.43);
  });

  it("returns one factor for a connected organization, role, and evidence selection", () => {
    const selection: MarkupFactorSelection = {
      organizationType: "company-association",
      personnelRole: "main",
      evidenceCount: "2",
    };

    expect(findMarkupFactor(markupFactors, selection)?.id).toBe("company-main-two-evidence");
    expect(findMarkupFactor(markupFactors, { ...selection, personnelRole: "assistant" })?.id).toBe("company-assistant");
    expect(findMarkupFactor(markupFactors, { ...selection, organizationType: "government" })?.id).toBe("government-main");
  });
});
