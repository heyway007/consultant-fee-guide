import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SearchFilters from "@/components/search-filters";

const filters = { query: "", professionalGroup: "all", experience: "all", degree: "bachelor" as const };
const stylesheet = readFileSync(resolve(process.cwd(), "app/globals.css"), "utf8");

describe("SearchFilters layout", () => {
  it("aligns the search field with the full filter row and keeps degree first", () => {
    render(<SearchFilters filters={filters} groups={["วิศวกรรม"]} experiences={[{ value: "1", label: "1 ปี" }]} onChange={() => undefined} />);

    const searchField = screen.getByRole("searchbox");
    const filterHeading = screen.getByRole("heading", { name: "ค้นหาอัตราที่ต้องการ" }).parentElement?.parentElement;
    expect(filterHeading).toContainElement(searchField);
    expect(searchField.closest(".filter-search-field")).toHaveClass("filter-span-all");

    const selects = screen.getAllByRole("combobox");
    expect(selects).toHaveLength(3);
    expect(selects[0]).toHaveValue("bachelor");
    expect(selects[1]).toHaveValue("all");
    expect(selects[2]).toHaveValue("all");
  });

  it("uses Font Awesome icons for reset, search, and select controls", () => {
    const { container } = render(<SearchFilters filters={filters} groups={["วิศวกรรม"]} experiences={[{ value: "1", label: "1 ปี" }]} onChange={() => undefined} />);

    expect(container.querySelector(".filter-title-icon")).toBeInTheDocument();
    expect(container.querySelectorAll(".clear-button")).toHaveLength(1);
    expect(container.querySelector(".clear-icon")).toBeInTheDocument();
    expect(container.querySelector(".search-icon")).toBeInTheDocument();
    expect(container.querySelector(".filter-label-title")).not.toBeInTheDocument();
    expect(container.querySelector(".input-with-icon input")?.getAttribute("aria-label")).toBe("ค้นหากลุ่มวิชาชีพหรือหมายเหตุ");
    expect(container.querySelector(".input-with-icon input")?.getAttribute("placeholder")).toBe("เช่น วิศวกรรม, สิ่งแวดล้อม");
    expect(container.querySelectorAll(".select-control")).toHaveLength(3);
    expect(container.querySelectorAll(".select-icon")).toHaveLength(3);
    expect(stylesheet).toContain(".input-with-icon input:focus { border-color:transparent; box-shadow:none; }");
  });
});
