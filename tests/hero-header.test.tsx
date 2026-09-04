import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HeroHeader from "@/components/hero-header";

describe("HeroHeader", () => {
  it("shows only the guide title", () => {
    render(<HeroHeader />);

    expect(screen.getByRole("banner")).toHaveTextContent("คู่มือเทียบราคาค่าจ้างที่ปรึกษา");
    expect(screen.getByRole("banner")).toHaveTextContent(/^คู่มือเทียบราคาค่าจ้างที่ปรึกษา$/);
    expect(screen.getByRole("img", { name: "โลโก้ TCEB" })).toBeInTheDocument();
  });
});
