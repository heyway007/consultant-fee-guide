"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { findMarkupFactor } from "@/lib/markup-factors";
import type { W16EvidenceCount, W16MarkupFactor, W16OrganizationType, W16PersonnelRole } from "@/lib/types";

type MarkupPanelProps = {
  factors: W16MarkupFactor[];
};

const factorFormatter = new Intl.NumberFormat("th-TH", { minimumFractionDigits: 3, maximumFractionDigits: 3 });

const organizationOptions: { value: W16OrganizationType; label: string }[] = [
  { value: "company-association", label: "บริษัท / มูลนิธิ / สมาคม" },
  { value: "government", label: "ภาครัฐ / สถาบันการศึกษาของรัฐ" },
  { value: "independent", label: "ที่ปรึกษาอิสระ" },
];

const roleOptions: { value: W16PersonnelRole; label: string }[] = [
  { value: "main", label: "บุคลากรหลัก" },
  { value: "assistant", label: "บุคลากรผู้ช่วย" },
];

const evidenceOptions: { value: W16EvidenceCount; label: string }[] = [
  { value: "3", label: "ครบ 3 ข้อ" },
  { value: "2", label: "ครบ 2 ข้อ" },
  { value: "1", label: "ครบ 1 ข้อ" },
  { value: "0", label: "ไม่มีหลักฐาน" },
];

export default function MarkupPanel({ factors }: MarkupPanelProps) {
  const [organizationType, setOrganizationType] = useState<W16OrganizationType>("company-association");
  const [personnelRole, setPersonnelRole] = useState<W16PersonnelRole>("main");
  const [evidenceCount, setEvidenceCount] = useState<W16EvidenceCount>("3");
  const selectedFactor = findMarkupFactor(factors, { organizationType, personnelRole, evidenceCount });
  const isCompany = organizationType === "company-association";
  const usesEvidence = isCompany && personnelRole === "main";

  return (
    <aside className="markup-panel" aria-label="Markup Factor">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">ส่วนประกอบราคา</p>
          <h2>Markup Factor</h2>
        </div>
        <span className="panel-icon" aria-hidden="true">×</span>
      </div>
      <p className="panel-description">เลือกเงื่อนไขให้ครบ ระบบจะแสดง Markup Factor ที่ตรงกับบุคลากร หน่วยงาน และหลักฐาน</p>
      <div className="markup-filters" aria-label="เงื่อนไข Markup Factor">
        <label>
          <span>บุคลากร</span>
          <div className="select-control">
            <select value={personnelRole} onChange={(event) => setPersonnelRole(event.target.value as W16PersonnelRole)}>
              {roleOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            <FontAwesomeIcon icon={faChevronDown} className="select-icon" aria-hidden="true" />
          </div>
        </label>
        <label>
          <span>ประเภทหน่วยงาน</span>
          <div className="select-control">
            <select value={organizationType} onChange={(event) => setOrganizationType(event.target.value as W16OrganizationType)}>
              {organizationOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            <FontAwesomeIcon icon={faChevronDown} className="select-icon" aria-hidden="true" />
          </div>
        </label>
        <label>
          <span>หลักฐานบริษัท{usesEvidence ? "" : " (ไม่ใช้กับเงื่อนไขนี้)"}</span>
          <div className="select-control">
            <select disabled={!usesEvidence} value={evidenceCount} onChange={(event) => setEvidenceCount(event.target.value as W16EvidenceCount)}>
              {evidenceOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            <FontAwesomeIcon icon={faChevronDown} className="select-icon" aria-hidden="true" />
          </div>
        </label>
      </div>
      {selectedFactor ? (
        <div className="factor-result">
          <div>
            <p className="eyebrow">Markup Factor ที่ตรงกัน</p>
            <strong>{selectedFactor.factor_label}</strong>
            <span>{selectedFactor.description}</span>
          </div>
          <div className="factor-value">
            <b>×{factorFormatter.format(selectedFactor.factor_value)}</b>
            <small>หน้า {selectedFactor.source_page ?? "-"}</small>
          </div>
        </div>
      ) : (
        <div className="factor-empty">ไม่พบ Markup Factor สำหรับเงื่อนไขนี้</div>
      )}
      <p className="panel-footnote">* บุคลากรสนับสนุนไม่มี Markup Factor ให้ใช้อัตรา Billing Rate ตามเอกสาร</p>
    </aside>
  );
}
