import { describe, expect, it } from "vitest";
import { getInitialGroupFromSearch } from "@/lib/group-navigation";

describe("initial group navigation", () => {
  it("uses the all view when no group is present in the URL", () => {
    expect(getInitialGroupFromSearch("")).toBe("all");
    expect(getInitialGroupFromSearch("?group=")).toBe("all");
  });

  it("reads a selected group from the URL after the page has mounted", () => {
    expect(getInitialGroupFromSearch("?group=วิศวกรรม")).toBe("วิศวกรรม");
  });
});
