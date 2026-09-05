import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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
  beforeEach(() => {
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
  });
  afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
  it("starts with five rows on a short notebook screen but allows a larger page", () => {
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
    const rows = Array.from({ length: 20 }, (_, index) => ({ ...row, id: `row-${index}` }));
    const { container } = render(<RateTable rows={rows} selectedDegree="all" />);
    expect(container.querySelectorAll("tbody tr")).toHaveLength(5);
    fireEvent.change(screen.getByRole("combobox", { name: "จำนวนรายการต่อหน้า" }), { target: { value: "20" } });
    expect(container.querySelectorAll("tbody tr")).toHaveLength(20);
  });
  it("paginates desktop and mobile rows and resets on page size or filter changes", () => {
    const rows = Array.from({ length: 61 }, (_, index) => ({ ...row, id: `row-${index}`, experience_label: `${index + 1} ปี` }));
    const { container, rerender } = render(<RateTable rows={rows} selectedDegree="all" paginationKey="initial" />);
    const assertRows = (count: number) => {
      expect(container.querySelectorAll("tbody tr")).toHaveLength(count);
      expect(container.querySelectorAll(".rate-card")).toHaveLength(count);
    };
    assertRows(10);
    expect(screen.getByRole("button", { name: "หน้าก่อนหน้า" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "หน้าถัดไป" }));
    expect(screen.getByRole("status")).toHaveTextContent("11–20 จาก 61 รายการ");
    expect(container.querySelector("tbody tr th")).toHaveTextContent("11 ปี");
    rerender(<RateTable rows={rows} selectedDegree="all" paginationKey="new-filter" />);
    expect(screen.getByRole("status")).toHaveTextContent("1–10 จาก 61 รายการ");
    rerender(<RateTable rows={rows} selectedDegree="all" paginationKey="initial" />);
    expect(screen.getByRole("status")).toHaveTextContent("1–10 จาก 61 รายการ");
    const select = screen.getByRole("combobox", { name: "จำนวนรายการต่อหน้า" });
    fireEvent.change(select, { target: { value: "20" } });
    assertRows(20);
    fireEvent.click(screen.getByRole("button", { name: "หน้าสุดท้าย" }));
    assertRows(1);
    expect(screen.getByRole("button", { name: "หน้าถัดไป" })).toBeDisabled();
    fireEvent.change(select, { target: { value: "50" } });
    assertRows(50);
    expect(screen.getByRole("status")).toHaveTextContent("1–50 จาก 61 รายการ");
    fireEvent.change(select, { target: { value: "all" } });
    assertRows(61);
    expect(screen.getByRole("button", { name: "หน้าถัดไป" })).toBeDisabled();
  });

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
    expect(document.querySelector(".personnel-role-cell")).toHaveTextContent("บุคลากรหลัก");
  });

  it("uses one table header row with an icon for each column", () => {
    const { container } = render(<RateTable rows={[row]} selectedDegree="all" />);

    expect(container.querySelectorAll(".rate-table thead tr")).toHaveLength(1);
    expect(container.querySelectorAll(".table-heading-icon")).toHaveLength(6);
    expect(container.querySelector("thead th")?.textContent).toContain("ประสบการณ์");
    expect(container.querySelector(".personnel-role-cell")).toHaveTextContent("ตรี: ผู้ช่วย");
    expect(container.querySelector(".personnel-role-cell")).toHaveTextContent("โท: หลัก");
    expect(container.querySelector(".personnel-role-cell")).toHaveTextContent("เอก: หลัก");
  });
});
