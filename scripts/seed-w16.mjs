import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("ต้องตั้งค่า NEXT_PUBLIC_SUPABASE_URL และ SUPABASE_SERVICE_ROLE_KEY ก่อน seed ข้อมูล");
  process.exit(1);
}

const rates = JSON.parse(await fs.readFile(path.join(root, "data", "w16-rates.json"), "utf8"));
const factors = JSON.parse(await fs.readFile(path.join(root, "data", "w16-markup-factors.json"), "utf8"));
const supabase = createClient(url, key, { auth: { persistSession: false } });

const { data: insertedRates, error: ratesError } = await supabase
  .from("w16_rate_rows")
  .upsert(rates, { onConflict: "professional_group,experience_years" })
  .select("id, professional_group, experience_years");
if (ratesError) throw ratesError;

const { data: insertedFactors, error: factorsError } = await supabase
  .from("w16_markup_factors")
  .upsert(factors, { onConflict: "factor_type,factor_label" })
  .select("id, factor_type, factor_label");
if (factorsError) throw factorsError;

console.log(`seeded ${insertedRates?.length ?? 0} rate rows and ${insertedFactors?.length ?? 0} markup factors`);
