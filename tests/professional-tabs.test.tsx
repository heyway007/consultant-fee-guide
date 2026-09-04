import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProfessionalTabs from "@/components/professional-tabs";

describe("ProfessionalTabs", () => {
  it("includes an all professional groups tab before the group tabs", () => {
    render(<ProfessionalTabs groups={["วิศวกรรม", "สถาปัตยกรรม"]} activeGroup="all" onChange={() => undefined} />);

    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(3);
    expect(tabs[0]).toHaveTextContent("ทุกกลุ่มวิชาชีพ");
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(tabs[0].querySelector(".professional-tab-icon")).toBeInTheDocument();
    expect(tabs[0].querySelector(".tab-index")).not.toBeInTheDocument();
    expect(tabs[1].querySelector(".professional-tab-icon")).toBeInTheDocument();
    expect(tabs[1].querySelector(".tab-index")).not.toBeInTheDocument();
  });
});
