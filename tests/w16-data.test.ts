import { describe, expect, it } from "vitest";
import { getW16Data, markupFactors, rateRows, supportStaff } from "@/lib/w16-data";
import { groupRateRows } from "@/lib/w16-filter";

describe("W16 JSON data", () => {
  it("contains all 31 experience bands for each of the 10 professional groups", () => {
    const groupedRows = groupRateRows(rateRows);

    expect(groupedRows.size).toBe(10);
    expect(rateRows).toHaveLength(310);

    for (const rows of groupedRows.values()) {
      expect(rows).toHaveLength(31);
      expect(rows.map((row) => row.experience_years)).toEqual(Array.from({ length: 31 }, (_, index) => index + 1));
      expect(rows.at(-1)?.experience_label).toBe("มากกว่า 30 ปี");
    }

    expect(rateRows.every((row) => !/[๐-๙]/u.test(`${row.experience_label} ${row.source_table ?? ""}`))).toBe(true);
  });

  it("loads rates and markup factors from the project JSON", async () => {
    await expect(getW16Data()).resolves.toEqual({ rates: rateRows, markupFactors, supportStaff });
  });
});
