import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen, faBullhorn, faBuilding, faCalculator, faCompassDrafting, faFlask, faHelmetSafety, faLaptopCode, faLayerGroup, faLeaf, faMoneyBillTrendUp, faScaleBalanced } from "@fortawesome/free-solid-svg-icons";

type ProfessionalTabsProps = {
  groups: string[];
  activeGroup: string;
  onChange: (group: string) => void;
};

const groupIcons: Record<string, IconDefinition> = {
  "วิศวกรรม": faHelmetSafety,
  "สถาปัตยกรรม": faCompassDrafting,
  "วิทยาศาสตร์สิ่งแวดล้อม": faLeaf,
  "เทคโนโลยีสารสนเทศและการสื่อสาร": faLaptopCode,
  "การเงิน": faMoneyBillTrendUp,
  "กฎหมาย": faScaleBalanced,
  "บัญชี": faCalculator,
  "บริหารและการพัฒนาองค์กร": faBuilding,
  "วิจัย": faFlask,
  "ประชาสัมพันธ์": faBullhorn,
};

function getGroupIcon(group: string) {
  return groupIcons[group] ?? faBookOpen;
}

export default function ProfessionalTabs({ groups, activeGroup, onChange }: ProfessionalTabsProps) {
  return (
    <div className="professional-tabs" role="tablist" aria-label="กลุ่มวิชาชีพ" onKeyDown={(event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const options = ["all", ...groups];
      const current = Math.max(0, options.indexOf(activeGroup));
      const next = event.key === "Home" ? 0 : event.key === "End" ? options.length - 1 : (current + (event.key === "ArrowRight" ? 1 : -1) + options.length) % options.length;
      onChange(options[next]);
      const button = event.currentTarget.querySelectorAll<HTMLButtonElement>("button")[next];
      button?.focus({ preventScroll: true });
      button?.scrollIntoView({ block: "nearest", inline: "nearest" });
    }}>
      <button
        className={`professional-tab ${activeGroup === "all" ? "is-active" : ""}`}
        type="button"
        role="tab"
        aria-selected={activeGroup === "all"}
        tabIndex={activeGroup === "all" ? 0 : -1}
        onClick={() => onChange("all")}
      >
        <FontAwesomeIcon icon={faLayerGroup} className="professional-tab-icon" aria-hidden="true" />
        ทุกกลุ่มวิชาชีพ
      </button>
      {groups.map((group) => (
        <button
          key={group}
          className={`professional-tab ${activeGroup === group ? "is-active" : ""}`}
          type="button"
          role="tab"
          aria-selected={activeGroup === group}
          tabIndex={activeGroup === group ? 0 : -1}
          onClick={() => onChange(group)}
        >
          <FontAwesomeIcon icon={getGroupIcon(group)} className="professional-tab-icon" aria-hidden="true" />
          {group}
        </button>
      ))}
    </div>
  );
}
