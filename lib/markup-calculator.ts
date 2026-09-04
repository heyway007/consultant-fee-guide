export type ConsultantFeeInputs = {
  baseSalary: number | null;
  markupFactor: number | null;
  months: number | null;
  workPercentage: number | null;
};

export function parseCalculatorNumber(value: string) {
  const normalized = value.replace(/,/g, "").replace(/%/g, "").trim();
  if (!normalized) return null;

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

export function calculateConsultantFee({ baseSalary, markupFactor, months, workPercentage }: ConsultantFeeInputs) {
  if (baseSalary === null || markupFactor === null || months === null || workPercentage === null) return null;
  if (baseSalary < 0 || markupFactor < 0 || months <= 0 || workPercentage < 1 || workPercentage > 100) return null;

  return baseSalary * markupFactor * months * (workPercentage / 100);
}

export type SupportStaffFeeInputs = {
  monthlyRate: number | null;
  months: number | null;
  workPercentage: number | null;
};

export function calculateSupportStaffFee({ monthlyRate, months, workPercentage }: SupportStaffFeeInputs) {
  if (monthlyRate === null || months === null || workPercentage === null) return null;
  if (monthlyRate < 0 || months <= 0 || workPercentage < 1 || workPercentage > 100) return null;

  return monthlyRate * months * (workPercentage / 100);
}
