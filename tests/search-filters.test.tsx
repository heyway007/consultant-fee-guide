import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SearchFilters from "@/components/search-filters";

const filters = { query: "", professionalGroup: "all", experience: "all", degree: "bachelor" as const };

describe("SearchFilters layout", () => {
  it("places the search field beside its heading and degree before the other filters", () => {
    render(<SearchFilters filters={filters} groups={["วิศวกรรม"]} experiences={[{ value: "1", label: "1 ปี" }]} onChange={() => undefined} />);

    const searchField = screen.getByRole("searchbox");
    const filterHeading = screen.getByRole("heading", { name: "ค้นหาอัตราที่ต้องการ" }).parentElement?.parentElement;
    expect(filterHeading).toContainElement(searchField);

    const selects = screen.getAllByRole("combobox");
    expect(selects).toHaveLength(3);
    expect(selects[0]).toHaveValue("bachelor");
    expect(selects[1]).toHaveValue("all");
    expect(selects[2]).toHaveValue("all");
  });
});
