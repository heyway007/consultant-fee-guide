"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import EmptyState from "@/components/empty-state";
import MarkupPanel from "@/components/markup-panel";
import ModeSwitcher from "@/components/mode-switcher";
import ProfessionalTabs from "@/components/professional-tabs";
import RateTable from "@/components/rate-table";
import SearchFilters from "@/components/search-filters";
import { getW16Data, previewMarkupFactors, previewRateRows, type W16Data } from "@/lib/w16-data";
import { filterRateRows, groupRateRows } from "@/lib/w16-filter";
import type { W16Filters, W16Mode } from "@/lib/types";

const initialFilters: W16Filters = { query: "", professionalGroup: "all", experience: "all", degree: "bachelor" };
const numberFormatter = new Intl.NumberFormat("th-TH");

function getInitialMode(): W16Mode {
  if (typeof window === "undefined") return "browse";
  const value = new URLSearchParams(window.location.search).get("mode");
  return value === "search" ? "search" : "browse";
}

function getInitialGroup() {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get("group") ?? "";
}

export default function Home() {
  const [data, setData] = useState<W16Data>({ rates: previewRateRows, markupFactors: previewMarkupFactors, source: "preview" });
  const [mode, setMode] = useState<W16Mode>(getInitialMode);
  const [activeGroup, setActiveGroup] = useState(getInitialGroup);
  const [filters, setFilters] = useState<W16Filters>(initialFilters);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestData = useCallback(() => getW16Data(), []);
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try { setData(await requestData()); }
    catch (loadError) { setError(loadError instanceof Error ? loadError.message : "โหลดข้อมูลไม่สำเร็จ"); }
    finally { setIsLoading(false); }
  }, [requestData]);

  useEffect(() => {
    let cancelled = false;
    requestData().then((nextData) => {
      if (!cancelled) setData(nextData);
    }).catch((loadError: unknown) => {
      if (!cancelled) setError(loadError instanceof Error ? loadError.message : "โหลดข้อมูลไม่สำเร็จ");
    }).finally(() => {
      if (!cancelled) setIsLoading(false);
    });
    return () => { cancelled = true; };
  }, [requestData]);

  const groupedRows = useMemo(() => groupRateRows(data.rates), [data.rates]);
  const groups = useMemo(() => Array.from(groupedRows.keys()), [groupedRows]);
  const experiences = useMemo(() => {
    const unique = new Map<number, string>();
    data.rates.forEach((row) => unique.set(row.experience_years, row.experience_label));
    return Array.from(unique.entries()).sort(([a], [b]) => a - b).map(([value, label]) => ({ value: String(value), label }));
  }, [data.rates]);

  const selectedGroup = groups.includes(activeGroup) ? activeGroup : (groups[0] ?? "");
  const visibleRows = mode === "search" ? filterRateRows(data.rates, filters) : (groupedRows.get(selectedGroup) ?? []);
  const updateUrl = (nextMode: W16Mode, nextGroup: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set("mode", nextMode);
    if (nextGroup) params.set("group", nextGroup); else params.delete("group");
    window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
  };
  const handleModeChange = (nextMode: W16Mode) => { setMode(nextMode); updateUrl(nextMode, selectedGroup); };
  const handleGroupChange = (nextGroup: string) => {
    setActiveGroup(nextGroup);
    setFilters((current) => ({ ...current, professionalGroup: nextGroup }));
    updateUrl(mode, nextGroup);
  };
  const handleFiltersChange = (nextFilters: W16Filters) => {
    setFilters(nextFilters);
    if (nextFilters.professionalGroup !== "all") { setActiveGroup(nextFilters.professionalGroup); updateUrl(mode, nextFilters.professionalGroup); }
  };
  const resetFilters = () => setFilters(initialFilters);

  return (
    <main className="site-shell">
      <header className="hero-section">
        <div className="hero-topline">
          <span className="brand-mark" aria-hidden="true">ว16</span>
          <span className="source-label">หลักเกณฑ์ราคากลางการจ้างที่ปรึกษา</span>
          <span className={`connection-pill ${data.source === "supabase" ? "is-connected" : ""}`}><span className="status-dot" aria-hidden="true" />{data.source === "supabase" ? "เชื่อมต่อฐานข้อมูล" : "โหมดตัวอย่าง"}</span>
        </div>
        <div className="hero-content">
          <div className="hero-copy"><p className="eyebrow">ค้นง่าย • เทียบชัด • อ้างอิงได้</p><h1>คู่มือเทียบราคาค่าจ้างที่ปรึกษา</h1><p className="hero-description">ค้นหาอัตราเงินเดือนพื้นฐานและ Markup Factor จากเอกสาร ว16 ในมุมมองเดียว ไม่ต้องเลื่อนหาใน PDF หลายหน้า</p></div>
          <div className="hero-note"><span className="note-number">{numberFormatter.format(data.rates.length)}</span><span>แถวข้อมูลที่เตรียมไว้</span></div>
        </div>
        <ModeSwitcher mode={mode} onChange={handleModeChange} />
      </header>

      <section className="content-section">
        {mode === "search" ? <SearchFilters filters={filters} groups={groups} experiences={experiences} onChange={handleFiltersChange} /> : <section className="browse-intro"><div><p className="eyebrow">ดูข้อมูลตามหมวด</p><h2>เลือกกลุ่มวิชาชีพเพื่อเปิดตาราง</h2></div><p>แต่ละแท็บแสดงอัตราค่าจ้างแยกตามประสบการณ์และระดับปริญญา</p></section>}
        {mode === "browse" && groups.length > 0 ? <ProfessionalTabs groups={groups} activeGroup={selectedGroup} onChange={handleGroupChange} /> : null}

        <div className="content-grid">
          <section className="results-section" aria-live="polite">
            <div className="results-heading"><div><p className="eyebrow">{mode === "search" ? "ผลการค้นหา" : "ตารางอัตราเงินเดือนพื้นฐาน"}</p><h2>{mode === "search" ? "รายการที่ตรงกับเงื่อนไข" : selectedGroup || "กำลังเตรียมข้อมูล"}</h2></div><span className="result-count">{numberFormatter.format(visibleRows.length)} แถว</span></div>
            {isLoading ? <div className="loading-box"><span className="loading-spinner" aria-hidden="true" />กำลังโหลดข้อมูลจากแหล่งข้อมูล...</div> : error ? <div className="error-box"><strong>เกิดข้อผิดพลาดในการโหลดข้อมูล</strong><span>{error}</span><button type="button" className="primary-button" onClick={() => void loadData()}>ลองใหม่</button></div> : visibleRows.length > 0 ? <RateTable rows={visibleRows} selectedDegree={filters.degree} /> : <EmptyState onReset={resetFilters} />}
          </section>
          <MarkupPanel factors={data.markupFactors} />
        </div>
      </section>
      <footer className="site-footer"><span>ข้อมูลอ้างอิง: หลักเกณฑ์ราคากลางการจ้างที่ปรึกษา</span><span>แสดงเพื่อช่วยค้นหาและเปรียบเทียบข้อมูล</span></footer>
    </main>
  );
}
