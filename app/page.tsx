"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import EmptyState from "@/components/empty-state";
import BackToTop from "@/components/back-to-top";
import HeroHeader from "@/components/hero-header";
import MarkupPanel from "@/components/markup-panel";
import ProfessionalTabs from "@/components/professional-tabs";
import RateTable from "@/components/rate-table";
import SearchFilters from "@/components/search-filters";
import { defaultFilters } from "@/lib/default-filters";
import { getInitialGroupFromSearch } from "@/lib/group-navigation";
import { getW16Data, markupFactors, rateRows, type W16Data } from "@/lib/w16-data";
import { groupRateRows, selectVisibleRows } from "@/lib/w16-filter";
import type { W16Filters } from "@/lib/types";

const numberFormatter = new Intl.NumberFormat("th-TH");

function subscribeToLocation(onStoreChange: () => void) {
  window.addEventListener("popstate", onStoreChange);
  return () => window.removeEventListener("popstate", onStoreChange);
}

function getClientLocationGroup() {
  return getInitialGroupFromSearch(window.location.search);
}

function getServerLocationGroup() {
  return "all";
}

export default function Home() {
  const [data, setData] = useState<W16Data>({ rates: rateRows, markupFactors });
  const locationGroup = useSyncExternalStore(subscribeToLocation, getClientLocationGroup, getServerLocationGroup);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [filters, setFilters] = useState<W16Filters>(defaultFilters);
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

  const requestedGroup = activeGroup ?? locationGroup;
  const selectedGroup = requestedGroup === "all" || groups.includes(requestedGroup) ? requestedGroup : (groups[0] ?? "");
  const hasSearchCriteria = Boolean(filters.query.trim() || filters.professionalGroup !== "all" || filters.experience !== "all");
  const visibleRows = selectVisibleRows(data.rates, groupedRows, selectedGroup, filters);
  const selectedBaseRate = useMemo(() => {
    if (selectedGroup === "all" || filters.degree === "all" || filters.experience === "all") return null;

    const row = groupedRows.get(selectedGroup)?.find((item) => String(item.experience_years) === filters.experience);
    if (!row) return null;

    if (filters.degree === "bachelor") return row.bachelor_rate;
    if (filters.degree === "master") return row.master_rate;
    return row.doctorate_rate;
  }, [filters.degree, filters.experience, groupedRows, selectedGroup]);
  const updateUrl = (nextGroup: string) => {
    const params = new URLSearchParams(window.location.search);
    if (nextGroup) params.set("group", nextGroup); else params.delete("group");
    window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
  };
  const handleGroupChange = (nextGroup: string) => {
    setActiveGroup(nextGroup);
    setFilters((currentFilters) => ({ ...currentFilters, professionalGroup: nextGroup }));
    updateUrl(nextGroup);
  };
  const handleFiltersChange = (nextFilters: W16Filters) => {
    setFilters(nextFilters);
    setActiveGroup(nextFilters.professionalGroup);
    updateUrl(nextFilters.professionalGroup);
  };
  const resetFilters = () => { setFilters(defaultFilters); setActiveGroup("all"); updateUrl("all"); };

  return (
    <main className="site-shell">
      <HeroHeader />

      <section className="content-section">
        <SearchFilters filters={filters} groups={groups} experiences={experiences} onChange={handleFiltersChange} />
        {groups.length > 0 ? <ProfessionalTabs groups={groups} activeGroup={selectedGroup} onChange={handleGroupChange} /> : null}

        <div className="content-grid">
          <section className="results-section" aria-live="polite">
            <div className="results-heading"><div><p className="eyebrow">{hasSearchCriteria ? "ผลการค้นหา" : "ตารางอัตราเงินเดือนพื้นฐาน"}</p><h2>{hasSearchCriteria ? "รายการที่ตรงกับเงื่อนไข" : selectedGroup === "all" ? "ทั้งหมด" : selectedGroup || "กำลังเตรียมข้อมูล"}</h2></div><span className="result-count">{numberFormatter.format(visibleRows.length)} แถว</span></div>
            {isLoading ? <div className="loading-box"><span className="loading-spinner" aria-hidden="true" />กำลังโหลดข้อมูลจากแหล่งข้อมูล...</div> : error ? <div className="error-box"><strong>เกิดข้อผิดพลาดในการโหลดข้อมูล</strong><span>{error}</span><button type="button" className="primary-button" onClick={() => void loadData()}>ลองใหม่</button></div> : visibleRows.length > 0 ? <RateTable rows={visibleRows} selectedDegree={filters.degree} /> : <EmptyState onReset={resetFilters} />}
          </section>
          <MarkupPanel factors={data.markupFactors} degree={filters.degree} experience={filters.experience} baseRate={selectedBaseRate} />
        </div>
      </section>
      <footer className="site-footer"><span>ข้อมูลอ้างอิง: หลักเกณฑ์ราคากลางการจ้างที่ปรึกษา</span><span>แสดงเพื่อช่วยค้นหาและเปรียบเทียบข้อมูล</span></footer>
      <BackToTop />
    </main>
  );
}
