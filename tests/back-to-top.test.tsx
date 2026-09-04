import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import BackToTop from "@/components/back-to-top";

describe("BackToTop", () => {
  it("appears after scrolling and smoothly returns to the top", () => {
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
    render(<BackToTop />);

    expect(screen.queryByRole("button", { name: "กลับขึ้นด้านบน" })).not.toBeInTheDocument();
    Object.defineProperty(window, "scrollY", { configurable: true, value: 400 });
    fireEvent.scroll(window);

    const button = screen.getByRole("button", { name: "กลับขึ้นด้านบน" });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });

    scrollTo.mockRestore();
  });
});
