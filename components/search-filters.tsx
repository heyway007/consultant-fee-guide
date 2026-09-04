import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faMagnifyingGlass, faRotateLeft } from "@fortawesome/free-solid-svg-icons";
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
      <div className="filter-toolbar">
        <p className="eyebrow">ค้นหาในเอกสาร ว16</p>
        {hasFilters ? (
          <div className="filter-actions">
            <button className="clear-button" type="button" onClick={() => onChange({ query: "", professionalGroup: "all", experience: "all", degree: "all" })}>
              <FontAwesomeIcon icon={faRotateLeft} className="clear-icon" aria-hidden="true" />
              ล้างตัวกรอง
            </button>
          </div>
        ) : null}
      </div>
      <div className="filter-heading">
        <div>
          <h2>ค้นหาอัตราที่ต้องการ</h2>
        </div>
        <label className="search-field filter-search-field">
          <span>คำค้น</span>
          <div className="input-with-icon">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" aria-hidden="true" />
            <input
              type="search"
              value={filters.query}
              onChange={(event) => update("query", event.target.value)}
              placeholder="เช่น วิศวกรรม, สิ่งแวดล้อม"
              aria-label="ค้นหากลุ่มวิชาชีพหรือหมายเหตุ"
            />
          </div>
        </label>
      </div>
      <div className="filter-grid">
        <label>
          <span>วุฒิการศึกษา</span>
          <div className="select-control">
            <select value={filters.degree} onChange={(event) => update("degree", event.target.value)}>
              {degreeOptions.map((degree) => <option key={degree.value} value={degree.value}>{degree.label}</option>)}
            </select>
            <FontAwesomeIcon icon={faChevronDown} className="select-icon" aria-hidden="true" />
          </div>
        </label>
        <label>
          <span>กลุ่มวิชาชีพ</span>
          <div className="select-control">
            <select value={filters.professionalGroup} onChange={(event) => update("professionalGroup", event.target.value)}>
              <option value="all">ทุกกลุ่มวิชาชีพ</option>
              {groups.map((group) => <option key={group} value={group}>{group}</option>)}
            </select>
            <FontAwesomeIcon icon={faChevronDown} className="select-icon" aria-hidden="true" />
          </div>
        </label>
        <label>
          <span>ประสบการณ์</span>
          <div className="select-control">
            <select value={filters.experience} onChange={(event) => update("experience", event.target.value)}>
              <option value="all">ทุกช่วงประสบการณ์</option>
              {experiences.map((experience) => <option key={experience.value} value={experience.value}>{experience.label}</option>)}
            </select>
            <FontAwesomeIcon icon={faChevronDown} className="select-icon" aria-hidden="true" />
          </div>
        </label>
      </div>
    </section>
  );
}
