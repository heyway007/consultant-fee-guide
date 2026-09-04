import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { W16RateRow } from "@/lib/types";
import RateTable from "@/components/rate-table";

const row: W16RateRow = {
  id: "engineering-5",
  professional_group: "วิศวกรรม",
  experience_years: 5,
  experience_label: "๕ ปี",
  bachelor_rate: 36000,
  master_rate: 42000,
  doctorate_rate: 48000,
  source_page: 11,
  source_table: "ตารางที่ ๑",
  notes: "ข้อมูลตัวอย่างสำหรับ preview",
};

describe("RateTable", () => {
  it("renders Thai degree headings and the selected degree state", () => {
    render(<RateTable rows={[row]} selectedDegree="master" />);

    expect(screen.getByRole("columnheader", { name: "ปริญญาตรี" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "ปริญญาโท" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("columnheader", { name: "วิชาชีพ" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "วิศวกรรม" })).toHaveClass("professional-cell");
    expect(screen.getAllByRole("cell")).toHaveLength(4);
    expect(document.querySelectorAll(".rate-value")).toHaveLength(3);
    expect(screen.queryByRole("columnheader", { name: "แหล่งอ้างอิง" })).not.toBeInTheDocument();
  });
});
