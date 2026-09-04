import { describe, expect, it } from "vitest";
import { calculateConsultantFee, parseCalculatorNumber } from "@/lib/markup-calculator";

describe("Markup Factor calculator", () => {
  it("calculates salary, factor, months, and work percentage together", () => {
    expect(calculateConsultantFee({ baseSalary: 50000, markupFactor: 2.64, months: 3, workPercentage: 50 })).toBe(198000);
    expect(calculateConsultantFee({ baseSalary: 50000, markupFactor: 2.64, months: 1, workPercentage: 100 })).toBe(132000);
  });

  it("parses editable values with comma grouping and percent signs", () => {
    expect(parseCalculatorNumber("50,000")).toBe(50000);
    expect(parseCalculatorNumber("2.640")).toBe(2.64);
    expect(parseCalculatorNumber("50% ")).toBe(50);
    expect(parseCalculatorNumber(" ")).toBeNull();
  });

  it("returns no result for incomplete or out-of-range inputs", () => {
    expect(calculateConsultantFee({ baseSalary: null, markupFactor: 2.64, months: 1, workPercentage: 100 })).toBeNull();
    expect(calculateConsultantFee({ baseSalary: 50000, markupFactor: 2.64, months: 1, workPercentage: 101 })).toBeNull();
    expect(calculateConsultantFee({ baseSalary: 50000, markupFactor: 2.64, months: 0, workPercentage: 100 })).toBeNull();
  });
});
