"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { findMarkupFactor, getPersonnelRole, resolvePersonnelRole, type PersonnelRoleSelection } from "@/lib/markup-factors";
import type { W16Degree, W16EvidenceCount, W16MarkupFactor, W16OrganizationType } from "@/lib/types";

type MarkupPanelProps = {
  factors: W16MarkupFactor[];
  degree: W16Degree | "all";
  experience: string;
};

const factorFormatter = new Intl.NumberFormat("th-TH", { minimumFractionDigits: 3, maximumFractionDigits: 3 });

const organizationOptions: { value: W16OrganizationType; label: string }[] = [
  { value: "company-association", label: "บริษัท / มูลนิธิ / สมาคม" },
  { value: "government", label: "ภาครัฐ / สถาบันการศึกษาของรัฐ" },
  { value: "independent", label: "ที่ปรึกษาอิสระ" },
];

const evidenceOptions: { value: W16EvidenceCount; label: string }[] = [
  { value: "3", label: "ครบ 3 ข้อ" },
  { value: "2", label: "ครบ 2 ข้อ" },
  { value: "1", label: "ครบ 1 ข้อ" },
  { value: "0", label: "ไม่มีหลักฐาน" },
];

const personnelRoleOptions: { value: PersonnelRoleSelection; label: string }[] = [
  { value: "auto", label: "อัตโนมัติตามวุฒิ/ประสบการณ์" },
  { value: "main", label: "บุคลากรหลัก" },
  { value: "assistant", label: "บุคลากรผู้ช่วย" },
];

export default function MarkupPanel({ factors, degree, experience }: MarkupPanelProps) {
  const [organizationType, setOrganizationType] = useState<W16OrganizationType>("company-association");
  const [evidenceCount, setEvidenceCount] = useState<W16EvidenceCount>("3");
  const [personnelRoleSelection, setPersonnelRoleSelection] = useState<PersonnelRoleSelection>("auto");
  const derivedPersonnelRole = getPersonnelRole(degree, experience);
  const isCompany = organizationType === "company-association";
  const selectedRole = organizationType === "independent"
    ? "any"
    : resolvePersonnelRole(personnelRoleSelection, degree, experience);
  const selectedFactor = selectedRole ? findMarkupFactor(factors, { organizationType, personnelRole: selectedRole, evidenceCount }) : undefined;
  const usesEvidence = isCompany && selectedRole === "main";
  const derivedRoleLabel = derivedPersonnelRole === "main"
    ? "บุคลากรหลัก"
    : derivedPersonnelRole === "assistant"
      ? "บุคลากรผู้ช่วย"
      : "เลือกวุฒิและประสบการณ์ด้านบน";

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
      <div className="markup-condition-layout" aria-label="เงื่อนไข Markup Factor">
        <div className={`derived-role${derivedPersonnelRole ? "" : " is-pending"}`}>
          <span>บุคลากรตามวุฒิ/ประสบการณ์</span>
          <strong>{derivedRoleLabel}</strong>
          <small>ค่าที่ระบบแนะนำจากเงื่อนไขด้านบน</small>
        </div>
        <div className="markup-edit-controls">
          <label>
            <span>บทบาทที่ใช้คำนวณ</span>
            <div className="select-control">
              <select value={personnelRoleSelection} onChange={(event) => setPersonnelRoleSelection(event.target.value as PersonnelRoleSelection)}>
                {personnelRoleOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
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
