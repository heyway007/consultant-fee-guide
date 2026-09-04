import type { W16Mode } from "@/lib/types";

type ModeSwitcherProps = {
  mode: W16Mode;
  onChange: (mode: W16Mode) => void;
};

export default function ModeSwitcher({ mode, onChange }: ModeSwitcherProps) {
  return (
    <div className="mode-switcher" role="tablist" aria-label="โหมดการดูข้อมูล">
      <button
        className={`mode-button ${mode === "browse" ? "is-active" : ""}`}
        onClick={() => onChange("browse")}
        role="tab"
        aria-selected={mode === "browse"}
        type="button"
      >
        <span aria-hidden="true">▦</span>
        ดูตามกลุ่มวิชาชีพ
      </button>
      <button
        className={`mode-button ${mode === "search" ? "is-active" : ""}`}
        onClick={() => onChange("search")}
        role="tab"
        aria-selected={mode === "search"}
        type="button"
      >
        <span aria-hidden="true">⌕</span>
        ค้นหาและเทียบ
      </button>
    </div>
  );
}
