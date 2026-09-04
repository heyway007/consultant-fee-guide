import type { W16Degree, W16RateRow } from "@/lib/types";

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
              <th scope="col" rowSpan={2}>ประสบการณ์</th>
              <th scope="col" colSpan={3} className="degree-group">ปริญญา</th>
              <th scope="col" rowSpan={2} className="professional-heading">วิชาชีพ</th>
            </tr>
            <tr>
              <th scope="col" aria-selected={selectedDegree === "bachelor"} className={degreeClass(selectedDegree, "bachelor")}>ปริญญาตรี</th>
              <th scope="col" aria-selected={selectedDegree === "master"} className={degreeClass(selectedDegree, "master")}>ปริญญาโท</th>
              <th scope="col" aria-selected={selectedDegree === "doctorate"} className={degreeClass(selectedDegree, "doctorate")}>ปริญญาเอก</th>
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
