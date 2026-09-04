import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import HeroHeader from "@/components/hero-header";

describe("HeroHeader", () => {
  afterEach(cleanup);

  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("shows only the guide title", () => {
    render(<HeroHeader />);

    expect(screen.getByRole("banner")).toHaveTextContent("คู่มือเทียบราคาค่าจ้างที่ปรึกษา");
    expect(screen.getByRole("heading", { name: "คู่มือเทียบราคาค่าจ้างที่ปรึกษา" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "โลโก้ TCEB" })).toBeInTheDocument();
  });

  it("toggles and persists the light and dark themes from the header", () => {
    render(<HeroHeader />);

    const themeButton = screen.getByRole("button", { name: "เปิดโหมดมืด" });
    fireEvent.click(themeButton);

    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(screen.getByRole("button", { name: "เปิดโหมดสว่าง" })).toBeInTheDocument();
    expect(window.localStorage.getItem("consultant-fee-theme")).toBe("dark");
  });
});
