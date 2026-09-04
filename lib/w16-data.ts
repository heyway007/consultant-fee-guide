import rateFixture from "@/data/w16-rates.json";
import markupFixture from "@/data/w16-markup-factors.json";
import supportStaffFixture from "@/data/w16-support-staff.json";
import type { W16MarkupFactor, W16RateRow, W16SupportStaff } from "@/lib/types";

export type W16Data = {
  rates: W16RateRow[];
  markupFactors: W16MarkupFactor[];
  supportStaff: W16SupportStaff[];
};

export const rateRows = rateFixture as W16RateRow[];
export const markupFactors = markupFixture as W16MarkupFactor[];
export const supportStaff = supportStaffFixture as W16SupportStaff[];

export async function getW16Data(): Promise<W16Data> {
  return { rates: rateRows, markupFactors, supportStaff };
}
