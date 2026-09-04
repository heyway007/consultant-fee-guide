import { describe, expect, it } from "vitest";
import { supportStaff } from "@/lib/w16-data";
import { calculateSupportStaffFee } from "@/lib/markup-calculator";

describe("support staff rates", () => {
  it("contains the four fixed monthly support staff rates from W16", () => {
    expect(supportStaff.map((staff) => [staff.position, staff.monthly_rate])).toEqual([
      ["ช่างเทคนิค", 31120],
      ["เลขานุการ", 20000],
      ["พนักงานพิมพ์ดีด", 18180],
      ["พนักงานธุรการ", 15460],
    ]);
  });

  it("calculates support staff pay without a markup factor", () => {
    expect(calculateSupportStaffFee({ monthlyRate: 31120, months: 3, workPercentage: 50 })).toBe(46680);
    expect(calculateSupportStaffFee({ monthlyRate: 20000, months: 1, workPercentage: 100 })).toBe(20000);
  });

  it("rejects incomplete or out-of-range support staff inputs", () => {
    expect(calculateSupportStaffFee({ monthlyRate: null, months: 1, workPercentage: 100 })).toBeNull();
    expect(calculateSupportStaffFee({ monthlyRate: 20000, months: 0, workPercentage: 100 })).toBeNull();
    expect(calculateSupportStaffFee({ monthlyRate: 20000, months: 1, workPercentage: 101 })).toBeNull();
  });
});
