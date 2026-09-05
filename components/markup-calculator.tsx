"use client";

import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalculator, faCheck, faCopy, faRotateLeft } from "@fortawesome/free-solid-svg-icons";
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
  const [copiedResult, setCopiedResult] = useState<string | null>(null);
  const baseSalary = baseSalaryOverride ?? formatBaseRate(baseRate);
  const factor = factorOverride ?? formatMarkupFactor(markupFactor);

  const result = useMemo(() => calculateConsultantFee({
    baseSalary: parseCalculatorNumber(baseSalary),
    markupFactor: parseCalculatorNumber(factor),
    months: parseCalculatorNumber(months),
    workPercentage: parseCalculatorNumber(workPercentage),
  }), [baseSalary, factor, months, workPercentage]);
  const formattedResult = result === null ? null : resultFormatter.format(result);
  const isCopied = formattedResult !== null && copiedResult === formattedResult;

  const resetAutomaticValues = () => {
    setBaseSalaryOverride(null);
    setFactorOverride(null);
    setMonths("1");
    setWorkPercentage("100");
  };

  const copyResult = async () => {
    if (formattedResult === null || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(formattedResult);
      setCopiedResult(formattedResult);
    } catch {
      setCopiedResult(null);
    }
  };

  return (
    <section className="markup-calculator" aria-label="คำนวณค่าจ้าง">
      <div className="calculator-heading">
        <div>
          <p className="eyebrow">คำนวณค่าจ้าง</p>
          <h3 className="calculator-title"><FontAwesomeIcon icon={faCalculator} className="calculator-title-icon" aria-hidden="true" />คำนวณอัตโนมัติ</h3>
        </div>
        <button type="button" className="calculator-reset" onClick={resetAutomaticValues}>
          <FontAwesomeIcon icon={faRotateLeft} aria-hidden="true" />
          ค่าอัตโนมัติ
        </button>
      </div>
      <p className="calculator-description">แก้ไขตัวเลขแต่ละช่องได้อิสระ ระบบจะคำนวณผลลัพธ์ให้ทันที</p>
      <div className="calculator-input-grid">
        <label className="calculator-field calculator-field-wide">
          <span>ฐานเงินเดือน</span>
          <div className="calculator-input-wrap">
            <input aria-label="ฐานเงินเดือน" inputMode="decimal" value={baseSalary} onChange={(event) => setBaseSalaryOverride(event.target.value)} placeholder="เช่น 50,000" />
            <small>บาท</small>
          </div>
        </label>
        <label className="calculator-field">
          <span>Markup Factor</span>
          <div className="calculator-input-wrap">
            <input aria-label="Markup Factor" inputMode="decimal" value={factor} onChange={(event) => setFactorOverride(event.target.value)} placeholder="เช่น 2.640" />
            <small>เท่า</small>
          </div>
        </label>
        <label className="calculator-field">
          <span>ระยะเวลาทำงาน</span>
          <div className="calculator-input-wrap">
            <input aria-label="จำนวนเดือนที่ทำงาน" inputMode="decimal" value={months} onChange={(event) => setMonths(event.target.value)} placeholder="เช่น 3" />
            <small>เดือน</small>
          </div>
        </label>
        <label className="calculator-field calculator-field-wide">
          <span>สัดส่วนงาน (1–100%)</span>
          <div className="calculator-input-wrap">
            <input aria-label="สัดส่วนการทำงาน" inputMode="decimal" value={workPercentage} onChange={(event) => setWorkPercentage(event.target.value)} placeholder="เช่น 50" />
            <small>%</small>
          </div>
        </label>
      </div>
      <div className={`calculator-result${formattedResult === null ? " is-incomplete" : ""}`} aria-live="polite">
        <span>รวมค่าจ้างโดยประมาณ</span>
        <div className="calculator-result-value">
          <strong>{formattedResult === null ? "กรอกข้อมูลให้ครบ" : `${formattedResult} บาท`}</strong>
          <button type="button" className="calculator-copy" onClick={() => void copyResult()} disabled={formattedResult === null} aria-label={isCopied ? "คัดลอกแล้ว" : "คัดลอกผลลัพธ์"} title={isCopied ? "คัดลอกแล้ว" : "คัดลอกตัวเลขผลลัพธ์"}>
            <FontAwesomeIcon icon={isCopied ? faCheck : faCopy} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
