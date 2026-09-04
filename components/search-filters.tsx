import type { W16Degree, W16Filters } from "@/lib/types";

type SearchFiltersProps = {
  filters: W16Filters;
  groups: string[];
  experiences: { value: string; label: string }[];
  onChange: (filters: W16Filters) => void;
};

const degreeOptions: { value: W16Degree | "all"; label: string }[] = [
  { value: "all", label: "ทุกระดับ" },
  { value: "bachelor", label: "ปริญญาตรี" },
  { value: "master", label: "ปริญญาโท" },
  { value: "doctorate", label: "ปริญญาเอก" },
];

export default function SearchFilters({ filters, groups, experiences, onChange }: SearchFiltersProps) {
  const update = (key: keyof W16Filters, value: string) => onChange({ ...filters, [key]: value });
  const hasFilters = filters.query || filters.professionalGroup !== "all" || filters.experience !== "all" || filters.degree !== "all";

  return (
    <section className="filter-card" aria-label="ตัวกรองข้อมูล">
      <div className="filter-heading">
        <div>
          <p className="eyebrow">ค้นหาในเอกสาร ว16</p>
          <h2>ค้นหาอัตราที่ต้องการ</h2>
        </div>
        {hasFilters ? (
          <button className="clear-button" type="button" onClick={() => onChange({ query: "", professionalGroup: "all", experience: "all", degree: "all" })}>
            ล้างตัวกรอง
          </button>
        ) : null}
      </div>
      <div className="filter-grid">
        <label className="search-field filter-span-2">
          <span>คำค้น</span>
          <div className="input-with-icon">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              value={filters.query}
              onChange={(event) => update("query", event.target.value)}
              placeholder="เช่น วิศวกรรม, สิ่งแวดล้อม"
              aria-label="ค้นหากลุ่มวิชาชีพหรือหมายเหตุ"
            />
          </div>
        </label>
        <label>
          <span>กลุ่มวิชาชีพ</span>
          <select value={filters.professionalGroup} onChange={(event) => update("professionalGroup", event.target.value)}>
            <option value="all">ทุกกลุ่มวิชาชีพ</option>
            {groups.map((group) => <option key={group} value={group}>{group}</option>)}
          </select>
        </label>
        <label>
          <span>ประสบการณ์</span>
          <select value={filters.experience} onChange={(event) => update("experience", event.target.value)}>
            <option value="all">ทุกช่วงประสบการณ์</option>
            {experiences.map((experience) => <option key={experience.value} value={experience.value}>{experience.label}</option>)}
          </select>
        </label>
        <label>
          <span>วุฒิการศึกษา</span>
          <select value={filters.degree} onChange={(event) => update("degree", event.target.value)}>
            {degreeOptions.map((degree) => <option key={degree.value} value={degree.value}>{degree.label}</option>)}
          </select>
        </label>
      </div>
    </section>
  );
}
