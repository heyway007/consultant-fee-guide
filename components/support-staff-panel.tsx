"use client";

import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalculator, faUserTie } from "@fortawesome/free-solid-svg-icons";
import { calculateSupportStaffFee, parseCalculatorNumber } from "@/lib/markup-calculator";
import type { W16SupportStaff } from "@/lib/types";

type SupportStaffPanelProps = {
  staff: W16SupportStaff[];
};

const numberFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

function formatMoney(value: number) {
  return `${numberFormatter.format(value)} บาท`;
}

export default function SupportStaffPanel({ staff }: SupportStaffPanelProps) {
  const [selectedId, setSelectedId] = useState(staff[0]?.id ?? "");
  const [months, setMonths] = useState("1");
  const [workPercentage, setWorkPercentage] = useState("100");
  const selectedStaff = staff.find((item) => item.id === selectedId) ?? staff[0];
  const result = useMemo(() => calculateSupportStaffFee({
    monthlyRate: selectedStaff?.monthly_rate ?? null,
    months: parseCalculatorNumber(months),
    workPercentage: parseCalculatorNumber(workPercentage),
  }), [months, selectedStaff, workPercentage]);

  return (
    <section className="support-staff-panel" aria-label="บุคลากรสนับสนุน">
      <div className="support-staff-heading">
        <h2 className="support-staff-title"><FontAwesomeIcon icon={faUserTie} className="support-staff-title-icon" aria-hidden="true" />บุคลากรสนับสนุน</h2>
        <span className="support-no-markup">ไม่ใช้ Markup Factor</span>
      </div>
      <p className="support-staff-description">เลือกตำแหน่งเพื่อใช้เงินเดือนประจำตำแหน่งคำนวณค่าจ้างทีมงาน</p>
      <div className="support-staff-list" aria-label="รายการตำแหน่งบุคลากรสนับสนุน">
        {staff.map((item) => (
          <button key={item.id} type="button" className="support-staff-option" aria-pressed={selectedStaff?.id === item.id} onClick={() => setSelectedId(item.id)}>
            <span className="support-staff-option-label"><FontAwesomeIcon icon={faUserTie} aria-hidden="true" />{item.position}</span>
            <strong>{formatMoney(item.monthly_rate)} / เดือน</strong>
          </button>
        ))}
      </div>
      <div className="support-staff-calculator">
        <div className="support-staff-calculator-heading">
          <span><FontAwesomeIcon icon={faCalculator} aria-hidden="true" />คำนวณค่าจ้างทีมงานสนับสนุน</span>
          <small>เงินเดือน × เดือน × % การทำงาน</small>
        </div>
        <div className="support-staff-selected-rate">
          <span>เงินเดือนที่ใช้คำนวณ</span>
          <strong>{selectedStaff ? formatMoney(selectedStaff.monthly_rate) : "-"}</strong>
        </div>
        <div className="support-staff-fields">
          <label>
            <span>จำนวนเดือน</span>
            <div className="calculator-input-wrap">
              <input aria-label="จำนวนเดือนสำหรับบุคลากรสนับสนุน" inputMode="decimal" value={months} onChange={(event) => setMonths(event.target.value)} />
              <small>เดือน</small>
            </div>
          </label>
          <label>
            <span>สัดส่วนการทำงาน</span>
            <div className="calculator-input-wrap">
              <input aria-label="สัดส่วนการทำงานสำหรับบุคลากรสนับสนุน" inputMode="decimal" value={workPercentage} onChange={(event) => setWorkPercentage(event.target.value)} />
              <small>%</small>
            </div>
          </label>
        </div>
        <div className="support-staff-result" aria-live="polite">
          <span>รวมค่าจ้างโดยประมาณ</span>
          <strong>{result === null ? "กรอกข้อมูลให้ครบ" : formatMoney(result)}</strong>
        </div>
      </div>
    </section>
  );
}
