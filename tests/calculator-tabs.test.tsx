import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import MarkupPanel from "@/components/markup-panel";
import { markupFactors, supportStaff } from "@/lib/w16-data";

describe("Calculator tabs", () => {
  afterEach(cleanup);

  it("keeps independently edited calculator values when switching tabs", () => {
    render(<MarkupPanel factors={markupFactors} supportStaff={supportStaff} degree="doctorate" experience="2" baseRate={50000} />);
    fireEvent.change(screen.getByRole("textbox", { name: "จำนวนเดือนที่ทำงาน" }), { target: { value: "3" } });
    expect(screen.getByText("396,000 บาท")).toBeVisible();
    fireEvent.click(screen.getByRole("tab", { name: "บุคลากรสนับสนุน" }));
    expect(screen.getByRole("tabpanel", { name: "บุคลากรสนับสนุน" })).toBeVisible();
    expect(screen.queryByRole("textbox", { name: "ฐานเงินเดือน" })).not.toBeInTheDocument();
    fireEvent.change(screen.getByRole("textbox", { name: "จำนวนเดือนสำหรับบุคลากรสนับสนุน" }), { target: { value: "2" } });
    fireEvent.click(screen.getByRole("tab", { name: "ที่ปรึกษา" }));
    expect(screen.getByRole("textbox", { name: "จำนวนเดือนที่ทำงาน" })).toHaveValue("3");
    fireEvent.keyDown(screen.getByRole("tab", { name: "ที่ปรึกษา" }), { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: "บุคลากรสนับสนุน" })).toHaveFocus();
    expect(screen.getByRole("textbox", { name: "จำนวนเดือนสำหรับบุคลากรสนับสนุน" })).toHaveValue("2");
  });
});
