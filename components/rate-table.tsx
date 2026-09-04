import type { W16Degree, W16RateRow } from "@/lib/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase, faClock, faGraduationCap } from "@fortawesome/free-solid-svg-icons";

type RateTableProps = {
  rows: W16RateRow[];
  selectedDegree: W16Degree | "all";
};

const numberFormatter = new Intl.NumberFormat("th-TH");

function formatRate(value: number | null) {
  return value === null ? "-" : numberFormatter.format(value);
}

function degreeClass(selectedDegree: W16Degree | "all", degree: W16Degree) {
  return selectedDegree === degree ? "degree-selected" : "";
}

export default function RateTable({ rows, selectedDegree }: RateTableProps) {
  return (
    <div className="rate-table-shell">
      <div className="rate-table-scroll">
        <table className="rate-table">
          <colgroup>
            <col className="experience-column" />
            <col span={3} className="degree-column" />
            <col className="professional-column" />
          </colgroup>
          <thead>
            <tr>
              <th scope="col"><span className="table-heading-label"><FontAwesomeIcon icon={faClock} className="table-heading-icon" aria-hidden="true" />ประสบการณ์</span></th>
              <th scope="col" aria-selected={selectedDegree === "bachelor"} className={degreeClass(selectedDegree, "bachelor")}><span className="table-heading-label"><FontAwesomeIcon icon={faGraduationCap} className="table-heading-icon" aria-hidden="true" />ปริญญาตรี</span></th>
              <th scope="col" aria-selected={selectedDegree === "master"} className={degreeClass(selectedDegree, "master")}><span className="table-heading-label"><FontAwesomeIcon icon={faGraduationCap} className="table-heading-icon" aria-hidden="true" />ปริญญาโท</span></th>
              <th scope="col" aria-selected={selectedDegree === "doctorate"} className={degreeClass(selectedDegree, "doctorate")}><span className="table-heading-label"><FontAwesomeIcon icon={faGraduationCap} className="table-heading-icon" aria-hidden="true" />ปริญญาเอก</span></th>
              <th scope="col" className="professional-heading"><span className="table-heading-label"><FontAwesomeIcon icon={faBriefcase} className="table-heading-icon" aria-hidden="true" />วิชาชีพ</span></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <th scope="row">
                  <span className="experience-number">{row.experience_label}</span>
                  <span className="experience-caption">ประสบการณ์</span>
                </th>
                <td className={`${degreeClass(selectedDegree, "bachelor")} rate-value rate-highlight`}>{formatRate(row.bachelor_rate)}</td>
                <td className={`${degreeClass(selectedDegree, "master")} rate-value rate-highlight`}>{formatRate(row.master_rate)}</td>
                <td className={`${degreeClass(selectedDegree, "doctorate")} rate-value rate-highlight`}>{formatRate(row.doctorate_rate)}</td>
                <td className="professional-cell">{row.professional_group}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="rate-cards">
        {rows.map((row) => (
          <article className="rate-card" key={row.id}>
            <div className="rate-card-heading">
              <div><span className="experience-number">{row.experience_label}</span><span className="experience-caption">ประสบการณ์</span></div>
              <span className="professional-chip">{row.professional_group}</span>
            </div>
            <div className="rate-card-grid">
              <div className={degreeClass(selectedDegree, "bachelor")}><span>ตรี</span><strong>{formatRate(row.bachelor_rate)}</strong></div>
              <div className={degreeClass(selectedDegree, "master")}><span>โท</span><strong>{formatRate(row.master_rate)}</strong></div>
              <div className={degreeClass(selectedDegree, "doctorate")}><span>เอก</span><strong>{formatRate(row.doctorate_rate)}</strong></div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
