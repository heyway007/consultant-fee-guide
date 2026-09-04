type ProfessionalTabsProps = {
  groups: string[];
  activeGroup: string;
  onChange: (group: string) => void;
};

export default function ProfessionalTabs({ groups, activeGroup, onChange }: ProfessionalTabsProps) {
  return (
    <div className="professional-tabs" role="tablist" aria-label="กลุ่มวิชาชีพ">
      <button
        className={`professional-tab ${activeGroup === "all" ? "is-active" : ""}`}
        type="button"
        role="tab"
        aria-selected={activeGroup === "all"}
        tabIndex={activeGroup === "all" ? 0 : -1}
        onClick={() => onChange("all")}
      >
        <span className="tab-index">00</span>
        ทุกกลุ่มวิชาชีพ
      </button>
      {groups.map((group, index) => (
        <button
          key={group}
          className={`professional-tab ${activeGroup === group ? "is-active" : ""}`}
          type="button"
          role="tab"
          aria-selected={activeGroup === group}
          tabIndex={activeGroup === group ? 0 : -1}
          onClick={() => onChange(group)}
        >
          <span className="tab-index">{String(index + 1).padStart(2, "0")}</span>
          {group}
        </button>
      ))}
    </div>
  );
}
