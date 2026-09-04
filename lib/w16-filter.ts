import type { W16Filters, W16RateRow } from "@/lib/types";

const normalize = (value: string) => value.trim().toLocaleLowerCase("th-TH");

export function filterRateRows(rows: W16RateRow[], filters: W16Filters): W16RateRow[] {
  const query = normalize(filters.query);

  return rows.filter((row) => {
    const searchable = normalize(`${row.professional_group} ${row.experience_label} ${row.notes ?? ""}`);
    const matchesQuery = !query || searchable.includes(query);
    const matchesGroup = filters.professionalGroup === "all" || row.professional_group === filters.professionalGroup;
    const matchesExperience = filters.experience === "all" || String(row.experience_years) === filters.experience;

    return matchesQuery && matchesGroup && matchesExperience;
  });
}

export function groupRateRows(rows: W16RateRow[]): Map<string, W16RateRow[]> {
  const groups = new Map<string, W16RateRow[]>();

  for (const row of rows) {
    const group = groups.get(row.professional_group) ?? [];
    group.push(row);
    groups.set(row.professional_group, group);
  }

  for (const [groupName, groupRows] of groups) {
    groups.set(groupName, [...groupRows].sort((a, b) => a.experience_years - b.experience_years));
  }

  return groups;
}
