import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import MarkupCalculator from "@/components/markup-calculator";

describe("Markup Calculator", () => {
  it("copies the calculated number without the currency label", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });

    render(<MarkupCalculator baseRate={50000} markupFactor={2.64} />);

    expect(screen.getByText("132,000 บาท")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "คัดลอกผลลัพธ์" }));

    await waitFor(() => expect(writeText).toHaveBeenCalledWith("132,000"));
    expect(screen.getByRole("button", { name: "คัดลอกแล้ว" })).toBeInTheDocument();
  });
});
