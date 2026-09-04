import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SupportStaffPanel from "@/components/support-staff-panel";
import type { W16SupportStaff } from "@/lib/types";

const staff: W16SupportStaff[] = [
  { id: "technical-staff", position: "ช่างเทคนิค", monthly_rate: 31120, source_page: null, source_table: null },
  { id: "secretary", position: "เลขานุการ", monthly_rate: 20000, source_page: null, source_table: null },
  { id: "typist", position: "พนักงานพิมพ์ดีด", monthly_rate: 18180, source_page: null, source_table: null },
  { id: "administrative-staff", position: "พนักงานธุรการ", monthly_rate: 15460, source_page: null, source_table: null },
];

describe("SupportStaffPanel", () => {
  it("shows all support staff rates and calculates without a markup factor", () => {
    render(<SupportStaffPanel staff={staff} />);

    expect(screen.getByRole("heading", { name: "บุคลากรสนับสนุน" })).toBeInTheDocument();
    expect(screen.getByText("ไม่ใช้ Markup Factor")).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(4);
    expect(screen.getByRole("button", { name: /ช่างเทคนิค/ })).toHaveAttribute("aria-pressed", "true");
    expect(document.querySelector(".support-staff-selected-rate strong")).toHaveTextContent("31,120 บาท");

    fireEvent.click(screen.getByRole("button", { name: /เลขานุการ/ }));

    expect(screen.getByRole("button", { name: /เลขานุการ/ })).toHaveAttribute("aria-pressed", "true");
    expect(document.querySelector(".support-staff-selected-rate strong")).toHaveTextContent("20,000 บาท");
  });
});
