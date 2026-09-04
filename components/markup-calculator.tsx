"use client";

import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { calculateConsultantFee, parseCalculatorNumber } from "@/lib/markup-calculator";

type MarkupCalculatorProps = {
  baseRate: number | null;
  markupFactor: number | null;
};

const inputFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
const resultFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

function formatBaseRate(value: number | null) {
  return value === null ? "" : inputFormatter.format(value);
}

function formatMarkupFactor(value: number | null) {
  return value === null ? "" : value.toFixed(3);
}

export default function MarkupCalculator({ baseRate, markupFactor }: MarkupCalculatorProps) {
  const [baseSalaryOverride, setBaseSalaryOverride] = useState<string | null>(null);
  const [factorOverride, setFactorOverride] = useState<string | null>(null);
  const [months, setMonths] = useState("1");
  const [workPercentage, setWorkPercentage] = useState("100");
  const baseSalary = baseSalaryOverride ?? formatBaseRate(baseRate);
  const factor = factorOverride ?? formatMarkupFactor(markupFactor);

  const result = useMemo(() => calculateConsultantFee({
    baseSalary: parseCalculatorNumber(baseSalary),
    markupFactor: parseCalculatorNumber(factor),
    months: parseCalculatorNumber(months),
    workPercentage: parseCalculatorNumber(workPercentage),
  }), [baseSalary, factor, months, workPercentage]);

  const resetAutomaticValues = () => {
    setBaseSalaryOverride(null);
    setFactorOverride(null);
    setMonths("1");
    setWorkPercentage("100");
  };

  return (
    <section className="markup-calculator" aria-label="คำนวณค่าจ้าง">
      <div className="calculator-heading">
        <div>
          <p className="eyebrow">คำนวณค่าจ้าง</p>
          <h3>คำนวณอัตโนมัติ</h3>
        </div>
        <button type="button" className="calculator-reset" onClick={resetAutomaticValues}>
          <FontAwesomeIcon icon={faRotateLeft} aria-hidden="true" />
          ค่าอัตโนมัติ
        </button>
      </div>
      <p className="calculator-description">แก้ไขตัวเลขแต่ละช่องได้อิสระ ระบบจะคำนวณผลลัพธ์ให้ทันที</p>
      <div className="calculator-input-grid">
        <label className="calculator-field calculator-field-wide">
          <span>1. ฐานเงินเดือน (จากประสบการณ์)</span>
          <div className="calculator-input-wrap">
            <input aria-label="ฐานเงินเดือน" inputMode="decimal" value={baseSalary} onChange={(event) => setBaseSalaryOverride(event.target.value)} placeholder="เช่น 50,000" />
            <small>บาท</small>
          </div>
        </label>
        <label className="calculator-field">
          <span>2. Markup Factor ตามกฎ</span>
          <div className="calculator-input-wrap">
            <input aria-label="Markup Factor" inputMode="decimal" value={factor} onChange={(event) => setFactorOverride(event.target.value)} placeholder="เช่น 2.640" />
            <small>เท่า</small>
          </div>
        </label>
        <label className="calculator-field">
          <span>3. จำนวนเดือนที่ทำงาน</span>
          <div className="calculator-input-wrap">
            <input aria-label="จำนวนเดือนที่ทำงาน" inputMode="decimal" value={months} onChange={(event) => setMonths(event.target.value)} placeholder="เช่น 3" />
            <small>เดือน</small>
          </div>
        </label>
        <label className="calculator-field calculator-field-wide">
          <span>4. สัดส่วนการทำงาน (1-100%)</span>
          <div className="calculator-input-wrap">
            <input aria-label="สัดส่วนการทำงาน" inputMode="decimal" value={workPercentage} onChange={(event) => setWorkPercentage(event.target.value)} placeholder="เช่น 50" />
            <small>%</small>
          </div>
        </label>
      </div>
      <div className="calculator-result" aria-live="polite">
        <span>รวมค่าจ้างโดยประมาณ</span>
        <strong>{result === null ? "กรอกข้อมูลให้ครบ" : `${resultFormatter.format(result)} บาท`}</strong>
      </div>
    </section>
  );
}
