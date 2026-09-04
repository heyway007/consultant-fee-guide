import { describe, expect, it } from "vitest";
import { previewRateRows } from "@/lib/w16-data";
import { groupRateRows } from "@/lib/w16-filter";

describe("W16 preview rate data", () => {
  it("contains all 31 experience bands for each of the 10 professional groups", () => {
    const groupedRows = groupRateRows(previewRateRows);

    expect(groupedRows.size).toBe(10);
    expect(previewRateRows).toHaveLength(310);

    for (const rows of groupedRows.values()) {
      expect(rows).toHaveLength(31);
      expect(rows.map((row) => row.experience_years)).toEqual(Array.from({ length: 31 }, (_, index) => index + 1));
      expect(rows.at(-1)?.experience_label).toBe("มากกว่า ๓๐ ปี");
    }
  });
});
