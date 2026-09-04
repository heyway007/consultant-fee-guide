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
    expect(screen.getAllByRole("cell")).toHaveLength(5);
    expect(document.querySelectorAll(".rate-value.rate-highlight")).toHaveLength(3);
    expect(document.querySelectorAll(".rate-table col")).toHaveLength(4);
    expect(document.querySelector(".degree-column")).toHaveAttribute("span", "3");
    expect(document.querySelector(".professional-column")).toBeInTheDocument();
    expect(screen.queryByRole("columnheader", { name: "แหล่งอ้างอิง" })).not.toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "บุคลากรตามวุฒิ/ประสบการณ์" })).toBeInTheDocument();
    expect(document.querySelector(".personnel-role-cell")).toHaveTextContent("บุคลากรผู้ช่วย");
  });

  it("uses one table header row with an icon for each column", () => {
    const { container } = render(<RateTable rows={[row]} selectedDegree="all" />);

    expect(container.querySelectorAll(".rate-table thead tr")).toHaveLength(1);
    expect(container.querySelectorAll(".table-heading-icon")).toHaveLength(6);
    expect(container.querySelector("thead th")?.textContent).toContain("ประสบการณ์");
    expect(container.querySelector(".personnel-role-cell")).toHaveTextContent("ตรี: ผู้ช่วย");
    expect(container.querySelector(".personnel-role-cell")).toHaveTextContent("เอก: หลัก");
  });
});
