import { describe, expect, it } from "vitest";
import type { W16RateRow } from "@/lib/types";
import { filterRateRows, groupRateRows, selectVisibleRows } from "@/lib/w16-filter";

const rows: W16RateRow[] = [
  {
    id: "civil-5",
    professional_group: "วิศวกรรมโยธา",
    experience_years: 5,
    experience_label: "๕ ปี",
    bachelor_rate: 42000,
    master_rate: 48000,
    doctorate_rate: 54000,
    source_page: 4,
    source_table: "ตารางที่ ๑",
    notes: null,
  },
  {
    id: "civil-1",
    professional_group: "วิศวกรรมโยธา",
    experience_years: 1,
    experience_label: "๑ ปี",
    bachelor_rate: 26000,
    master_rate: 30000,
    doctorate_rate: 34000,
    source_page: 4,
    source_table: "ตารางที่ ๑",
    notes: null,
  },
  {
    id: "architecture-5",
    professional_group: "สถาปัตยกรรม",
    experience_years: 5,
    experience_label: "๕ ปี",
    bachelor_rate: 40000,
    master_rate: 46000,
    doctorate_rate: 52000,
    source_page: 7,
    source_table: "ตารางที่ ๓",
    notes: "อัตราอ้างอิง",
  },
];

describe("filterRateRows", () => {
  it("matches a Thai keyword in the professional group", () => {
    expect(filterRateRows(rows, { query: "โยธา", professionalGroup: "all", experience: "all", degree: "all" })).toHaveLength(2);
  });

  it("matches selected group and experience together", () => {
    const result = filterRateRows(rows, {
      query: "",
      professionalGroup: "วิศวกรรมโยธา",
      experience: "5",
      degree: "master",
    });

    expect(result.map((row) => row.id)).toEqual(["civil-5"]);
  });

  it("leaves all degree rates on a matching row", () => {
    const result = filterRateRows(rows, { query: "", professionalGroup: "all", experience: "all", degree: "doctorate" });
    expect(result[0]).toMatchObject({ bachelor_rate: 42000, master_rate: 48000, doctorate_rate: 54000 });
  });
});

describe("groupRateRows", () => {
  it("sorts each group by numeric experience", () => {
    const groups = groupRateRows(rows);
    expect(groups.get("วิศวกรรมโยธา")?.map((row) => row.experience_years)).toEqual([1, 5]);
  });
});

describe("selectVisibleRows", () => {
  it("returns rows from every professional group when the all view is active", () => {
    const groupedRows = groupRateRows(rows);
    const result = selectVisibleRows(rows, groupedRows, "all", {
      query: "",
      professionalGroup: "all",
      experience: "all",
      degree: "bachelor",
    });

    expect(result.map((row) => row.id)).toEqual(["civil-1", "civil-5", "architecture-5"]);
  });
});
