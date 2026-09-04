import rateFixture from "@/data/w16-rates.json";
import markupFixture from "@/data/w16-markup-factors.json";
import { getSupabaseClient } from "@/lib/supabase";
import type { W16MarkupFactor, W16RateRow } from "@/lib/types";

export type W16Data = {
  rates: W16RateRow[];
  markupFactors: W16MarkupFactor[];
  source: "supabase" | "preview";
};

export const previewRateRows = rateFixture as W16RateRow[];
export const previewMarkupFactors = markupFixture as W16MarkupFactor[];

export async function getW16Data(): Promise<W16Data> {
  const supabase = getSupabaseClient();
  if (!supabase) return { rates: previewRateRows, markupFactors: previewMarkupFactors, source: "preview" };

  const [ratesResult, factorsResult] = await Promise.all([
    supabase.from("w16_rate_rows").select("*").order("professional_group").order("experience_years"),
    supabase.from("w16_markup_factors").select("*").order("sort_order"),
  ]);

  if (ratesResult.error || factorsResult.error) {
    throw new Error(ratesResult.error?.message ?? factorsResult.error?.message ?? "โหลดข้อมูลไม่สำเร็จ");
  }

  return {
    rates: (ratesResult.data ?? []) as W16RateRow[],
    markupFactors: (factorsResult.data ?? []) as W16MarkupFactor[],
    source: "supabase",
  };
}
