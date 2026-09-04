import type { W16MarkupFactor } from "@/lib/types";

type MarkupPanelProps = {
  factors: W16MarkupFactor[];
};

const factorFormatter = new Intl.NumberFormat("th-TH", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
const factorGroupLabels: Record<string, string> = {
  "company-evidence": "บริษัท / หลักฐานประกอบ",
};

function groupFactors(factors: W16MarkupFactor[]) {
  const groups = new Map<string, W16MarkupFactor[]>();
  factors.forEach((factor) => {
    const group = groups.get(factor.factor_group) ?? [];
    group.push(factor);
    groups.set(factor.factor_group, group);
  });
  return Array.from(groups.entries());
}

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
      <div className="factor-groups">
        {groupFactors(factors).map(([groupId, groupFactorsList]) => (
          <section className="factor-group" key={groupId} aria-labelledby={`factor-group-${groupId}`}>
            <h3 id={`factor-group-${groupId}`}>{factorGroupLabels[groupId] ?? groupId}</h3>
            <div className="factor-list">
              {groupFactorsList.map((factor) => (
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
          </section>
        ))}
      </div>
      <p className="panel-footnote">* ตรวจสอบเงื่อนไขและหลักฐานประกอบตามเอกสารต้นฉบับก่อนนำไปใช้งานจริง</p>
    </aside>
  );
}
