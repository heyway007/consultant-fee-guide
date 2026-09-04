import { describe, expect, it } from "vitest";
import { defaultFilters } from "@/lib/default-filters";

describe("default filters", () => {
  it("starts without a degree filter", () => {
    expect(defaultFilters).toEqual({
      query: "",
      professionalGroup: "all",
      experience: "all",
      degree: "all",
    });
  });
});
