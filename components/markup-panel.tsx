import type { W16MarkupFactor } from "@/lib/types";

type MarkupPanelProps = {
  factors: W16MarkupFactor[];
};

const factorFormatter = new Intl.NumberFormat("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function MarkupPanel({ factors }: MarkupPanelProps) {
  return (
    <aside className="markup-panel" aria-label="Markup Factor">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">ส่วนประกอบราคา</p>
          <h2>Markup Factor</h2>
        </div>
        <span className="panel-icon" aria-hidden="true">×</span>
      </div>
      <p className="panel-description">ตัวคูณอัตราค่าตอบแทนตามเงื่อนไขหลักเกณฑ์ ว16 ใช้เป็นข้อมูลประกอบการพิจารณา</p>
      <div className="factor-list">
        {factors.map((factor) => (
          <div className="factor-item" key={factor.id}>
            <div>
              <strong>{factor.factor_label}</strong>
              <span>{factor.description}</span>
            </div>
            <div className="factor-value">
              <b>×{factorFormatter.format(factor.factor_value)}</b>
              <small>หน้า {factor.source_page ?? "-"}</small>
            </div>
          </div>
        ))}
      </div>
      <p className="panel-footnote">* ตรวจสอบเงื่อนไขและหลักฐานประกอบตามเอกสารต้นฉบับก่อนนำไปใช้งานจริง</p>
    </aside>
  );
}
