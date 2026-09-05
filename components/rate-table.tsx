"use client";

import { useState, useSyncExternalStore } from "react";
import type { W16Degree, W16RateRow } from "@/lib/types";
import { getPersonnelRole as derivePersonnelRole } from "@/lib/markup-factors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase, faChevronDown, faChevronLeft, faChevronRight, faClock, faGraduationCap, faUserTie } from "@fortawesome/free-solid-svg-icons";

type RateTableProps = {
  rows: W16RateRow[];
  selectedDegree: W16Degree | "all";
  paginationKey?: string;
};

const numberFormatter = new Intl.NumberFormat("th-TH");
const compactScreenQuery = "(min-width: 961px) and (max-height: 850px)";

function subscribeToCompactScreen(onChange: () => void) {
  const media = window.matchMedia(compactScreenQuery);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function getCompactScreen() { return window.matchMedia(compactScreenQuery).matches; }
function getServerCompactScreen() { return false; }

const degreeOptions: { value: W16Degree; label: string }[] = [
  { value: "bachelor", label: "ตรี" },
  { value: "master", label: "โท" },
  { value: "doctorate", label: "เอก" },
];

function formatRate(value: number | null) {
  return value === null ? "-" : numberFormatter.format(value);
}

function degreeClass(selectedDegree: W16Degree | "all", degree: W16Degree) {
  return selectedDegree === degree ? "degree-selected" : "";
}

function getPersonnelRoleLabel(degree: W16Degree, experienceYears: number) {
  return derivePersonnelRole(degree, String(experienceYears)) === "main" ? "หลัก" : "ผู้ช่วย";
}

function formatPersonnelRoles(row: W16RateRow, selectedDegree: W16Degree | "all") {
  if (selectedDegree !== "all") return `บุคลากร${getPersonnelRoleLabel(selectedDegree, row.experience_years)}`;

  return degreeOptions
    .map((degree) => `${degree.label}: ${getPersonnelRoleLabel(degree.value, row.experience_years)}`)
    .join(" · ");
}

export default function RateTable({ rows, selectedDegree, paginationKey = "" }: RateTableProps) {
  const isCompactScreen = useSyncExternalStore(subscribeToCompactScreen, getCompactScreen, getServerCompactScreen);
  const [chosenPageSize, setPageSize] = useState<string | null>(null);
  const pageSize = chosenPageSize ?? (isCompactScreen ? "5" : "10");
  const resultKey = `${paginationKey}:${selectedDegree}:${pageSize}:${rows.map((row) => row.id).join(",")}`;
  const [pagination, setPagination] = useState({ key: resultKey, page: 1 });
  if (pagination.key !== resultKey) {
    setPagination({ key: resultKey, page: 1 });
  }
  const limit = pageSize === "all" ? Math.max(1, rows.length) : Number(pageSize);
  const pageCount = Math.max(1, Math.ceil(rows.length / limit));
  const page = pagination.key === resultKey ? Math.min(pagination.page, pageCount) : 1;
  const start = (page - 1) * limit;
  const pageRows = rows.slice(start, start + limit);
  const goToPage = (nextPage: number) => setPagination({ key: resultKey, page: nextPage });

  return (
    <div className="rate-table-shell">
      <div className="table-pagination-toolbar">
        <label className="page-size-label">
          แสดง
          <span className="select-control">
            <select aria-label="จำนวนรายการต่อหน้า" value={pageSize} onChange={(event) => { setPageSize(event.target.value); goToPage(1); }}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="all">ทั้งหมด</option>
            </select>
            <FontAwesomeIcon icon={faChevronDown} className="select-icon" aria-hidden="true" />
          </span>
          รายการ
        </label>
        <span role="status">{rows.length ? start + 1 : 0}–{Math.min(start + limit, rows.length)} จาก {numberFormatter.format(rows.length)} รายการ</span>
      </div>
      <div className="rate-table-scroll">
        <table className="rate-table">
          <colgroup>
            <col className="experience-column" />
            <col span={3} className="degree-column" />
            <col className="professional-column" />
            <col className="personnel-role-column" />
          </colgroup>
          <thead>
            <tr>
              <th scope="col"><span className="table-heading-label"><FontAwesomeIcon icon={faClock} className="table-heading-icon" aria-hidden="true" />ประสบการณ์</span></th>
              <th scope="col" aria-selected={selectedDegree === "bachelor"} className={degreeClass(selectedDegree, "bachelor")}><span className="table-heading-label"><FontAwesomeIcon icon={faGraduationCap} className="table-heading-icon" aria-hidden="true" />ปริญญาตรี</span></th>
              <th scope="col" aria-selected={selectedDegree === "master"} className={degreeClass(selectedDegree, "master")}><span className="table-heading-label"><FontAwesomeIcon icon={faGraduationCap} className="table-heading-icon" aria-hidden="true" />ปริญญาโท</span></th>
              <th scope="col" aria-selected={selectedDegree === "doctorate"} className={degreeClass(selectedDegree, "doctorate")}><span className="table-heading-label"><FontAwesomeIcon icon={faGraduationCap} className="table-heading-icon" aria-hidden="true" />ปริญญาเอก</span></th>
              <th scope="col" className="professional-heading"><span className="table-heading-label"><FontAwesomeIcon icon={faBriefcase} className="table-heading-icon" aria-hidden="true" />วิชาชีพ</span></th>
              <th scope="col" className="personnel-role-heading"><span className="table-heading-label"><FontAwesomeIcon icon={faUserTie} className="table-heading-icon" aria-hidden="true" />บุคลากรตามวุฒิ/ประสบการณ์</span></th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row) => (
              <tr key={row.id}>
                <th scope="row">
                  <span className="experience-number">{row.experience_label}</span>
                  <span className="experience-caption">ประสบการณ์</span>
                </th>
                <td className={`${degreeClass(selectedDegree, "bachelor")} rate-value rate-highlight`}>{formatRate(row.bachelor_rate)}</td>
                <td className={`${degreeClass(selectedDegree, "master")} rate-value rate-highlight`}>{formatRate(row.master_rate)}</td>
                <td className={`${degreeClass(selectedDegree, "doctorate")} rate-value rate-highlight`}>{formatRate(row.doctorate_rate)}</td>
                <td className="professional-cell">{row.professional_group}</td>
                <td className="personnel-role-cell">{formatPersonnelRoles(row, selectedDegree)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="rate-cards">
        {pageRows.map((row) => (
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
            <p className="rate-card-role">{formatPersonnelRoles(row, selectedDegree)}</p>
          </article>
        ))}
      </div>
      <nav className="table-pagination" aria-label="เปลี่ยนหน้าตาราง">
        <button type="button" onClick={() => goToPage(1)} disabled={page === 1}>หน้าแรก</button>
        <button type="button" aria-label="หน้าก่อนหน้า" onClick={() => goToPage(page - 1)} disabled={page === 1}><FontAwesomeIcon icon={faChevronLeft} aria-hidden="true" /></button>
        <span>หน้า {page} / {pageCount}</span>
        <button type="button" aria-label="หน้าถัดไป" onClick={() => goToPage(page + 1)} disabled={page === pageCount}><FontAwesomeIcon icon={faChevronRight} aria-hidden="true" /></button>
        <button type="button" onClick={() => goToPage(pageCount)} disabled={page === pageCount}>หน้าสุดท้าย</button>
      </nav>
    </div>
  );
}
