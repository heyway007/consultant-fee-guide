# คู่มือเทียบราคาค่าจ้างที่ปรึกษา Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** สร้างเว็บ Next.js แบบอ่านอย่างเดียวสำหรับค้นหาและดูตาราง ว16 แยกตามกลุ่มวิชาชีพ พร้อม Markup Factor จาก Supabase

**Architecture:** ใช้ Next.js App Router เป็นหน้าเว็บเดียว โดยแยกส่วนข้อมูล การกรอง และส่วนแสดงผลออกจากกัน หน้าเว็บโหลดข้อมูลผ่าน Supabase เมื่อมี environment variables และมีข้อมูลตัวอย่างสำหรับ preview/local development เท่านั้น ตารางจะรองรับสองโหมด: ค้นหา และดูตามแท็บกลุ่มวิชาชีพ

**Tech Stack:** Next.js, TypeScript, React, Tailwind CSS, Supabase JavaScript client, Vitest/React Testing Library สำหรับ logic และ UI behavior

**Spec:** `docs/superpowers/specs/2026-09-04-consultant-fee-guide-design.md`

## Global Constraints

- เว็บต้องเป็น read-only ไม่มีเพิ่ม แก้ไข ลบ หรืออัปโหลดข้อมูล
- ต้องมี 2 โหมด: โหมดค้นหา และโหมดดูตามกลุ่มวิชาชีพแบบแท็บ
- ต้องแสดงระดับปริญญาตรี โท เอก และเน้นราคาตามระดับที่เลือก
- ต้องแสดง Markup Factor แยกจากอัตราค่าจ้างพื้นฐาน
- ต้องเก็บ `source_page` และ `source_table` เพื่อย้อนตรวจสอบกับ PDF
- ใช้โทนสีตามสัดส่วน 60/30/10 และต้องไม่ใช้สีเป็นตัวสื่อความหมายเพียงอย่างเดียว
- ต้องรองรับ desktop/mobile และ production build ต้องผ่าน

## Files and Responsibilities

- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css` - โครง Next.js และ route หลัก
- Create: `lib/types.ts`, `lib/w16-data.ts`, `lib/w16-filter.ts`, `lib/supabase.ts` - โมเดลข้อมูล แหล่งข้อมูล และ logic การกรอง
- Create: `components/mode-switcher.tsx`, `components/search-filters.tsx`, `components/professional-tabs.tsx`, `components/rate-table.tsx`, `components/markup-panel.tsx`, `components/empty-state.tsx` - ส่วน UI ที่แบ่งตามหน้าที่
- Create: `supabase/migrations/001_w16_schema.sql` - schema, indexes, read-only policies และ relation ของ Markup Factor
- Create: `data/w16-rates.json`, `data/w16-markup-factors.json` - ข้อมูลที่ normalize จาก PDF พร้อมหน้าที่มา
- Create: `scripts/seed-w16.mjs` - seed ข้อมูลเข้า Supabase ผ่าน service role ที่อ่านจาก environment เฉพาะเครื่องมือ ไม่ฝัง secret ในเว็บ
- Create: `tests/w16-filter.test.ts`, `tests/rate-table.test.tsx` - ทดสอบ logic การกรองและการเน้นคอลัมน์ระดับปริญญา
- Create: `.env.example`, `README.md` - วิธีตั้งค่า Supabase และรันโปรเจ็กต์

### Task 1: Scaffold Next.js and establish the data boundary

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`
- Create: `app/layout.tsx`, `app/page.tsx`, `app/globals.css`
- Create: `lib/types.ts`, `lib/supabase.ts`, `.env.example`

**Interfaces:**
- `W16RateRow` contains `id`, `professional_group`, `experience_years`, `experience_label`, `bachelor_rate`, `master_rate`, `doctorate_rate`, `source_page`, `source_table`, and `notes`.
- `W16MarkupFactor` contains `id`, `factor_type`, `factor_label`, `factor_value`, `description`, `source_page`, and `sort_order`.
- `getSupabaseClient()` returns a browser-safe read-only client when `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` exist, otherwise returns `null`.

- [ ] **Step 1: Initialize the Next.js project**

Run from `C:\laragon\www\consultant-fee-guide`:

```powershell
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias "@/*" --use-npm
```

Expected: the project contains an App Router route and a working npm script without overwriting the design/spec files.

- [ ] **Step 2: Add Supabase client dependency and environment contract**

```powershell
npm install @supabase/supabase-js
```

Create `.env.example` with:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

The browser client may read only the two `NEXT_PUBLIC_` values. The service role key is reserved for the seed script and must never be imported by app code.

- [ ] **Step 3: Define the shared types and client factory**

Create `lib/types.ts` with `W16Degree = "bachelor" | "master" | "doctorate"`, `W16RateRow`, `W16MarkupFactor`, and `W16Mode = "browse" | "search"`. Create `lib/supabase.ts` with `getSupabaseClient()` and a `hasSupabaseConfig()` helper.

- [ ] **Step 4: Run the scaffold checks**

Run:

```powershell
npm run lint
npm run build
```

Expected: both commands pass before product UI work begins.

### Task 2: Model W16 rates and Markup Factor in Supabase

**Files:**
- Create: `supabase/migrations/001_w16_schema.sql`
- Create: `data/w16-rates.json`, `data/w16-markup-factors.json`
- Create: `scripts/seed-w16.mjs`

**Interfaces:**
- `w16_rate_rows` stores one professional-group/experience row and the three degree rates.
- `w16_markup_factors` stores each factor and its source page.
- `w16_rate_markup_map` links a rate row to one or more factors.
- The seed script reads JSON and uses `SUPABASE_SERVICE_ROLE_KEY` only in the script process.

- [ ] **Step 1: Write the schema migration**

Create the three tables from the approved spec, add indexes on `professional_group`, `experience_years`, and `factor_type`, enable RLS, and add select policies for the anonymous read role. Add foreign keys with cascade on the mapping table.

- [ ] **Step 2: Normalize the PDF data into source-traceable JSON**

Create one JSON object per visible W16 rate row. Preserve Thai labels as displayed in the source, store Arabic numeric values for sorting, and include `source_page` and `source_table`. Create one object per Markup Factor with its exact label/value and source page. Do not invent rows or factors where the source is unreadable; record the source location in `notes` for rows requiring confirmation.

- [ ] **Step 3: Implement the seed script**

The script must validate required fields, upsert rate rows by professional group plus experience, upsert factors by factor type plus label, and insert mappings using the generated IDs. If required environment variables are absent, exit with a clear message and a non-zero status.

- [ ] **Step 4: Validate the schema and fixture shape**

Run the JSON validation and, when Supabase environment values are available, run:

```powershell
node scripts/seed-w16.mjs
```

Expected: every seeded row has source metadata, numeric rates remain numeric, and no duplicate group/experience row is created.

### Task 3: Implement filtering and the two browsing modes

**Files:**
- Create: `lib/w16-data.ts`, `lib/w16-filter.ts`
- Create: `tests/w16-filter.test.ts`
- Modify: `app/page.tsx`

**Interfaces:**
- `W16Filters = { query: string; professionalGroup: string; experience: string; degree: W16Degree | "all" }`.
- `filterRateRows(rows: W16RateRow[], filters: W16Filters): W16RateRow[]` performs case-insensitive text matching and exact select matching.
- `groupRateRows(rows: W16RateRow[]): Map<string, W16RateRow[]>` sorts each group by `experience_years` ascending.
- `getRateRows()` reads from Supabase when configured and returns normalized local fixtures for local preview when it is not configured.

- [ ] **Step 1: Write failing filtering tests**

Cover text search, group selection, experience selection, degree selection, blank filters, and group sorting. Assert that a selected degree changes only the highlighted degree field and does not remove the other degree rates from the row.

- [ ] **Step 2: Run the focused tests and confirm failure**

Run:

```powershell
npx vitest run tests/w16-filter.test.ts
```

Expected: FAIL because the filtering functions do not exist yet.

- [ ] **Step 3: Implement the minimal data and filtering functions**

Implement the exact interfaces above. Treat an empty query/filter as no restriction. Match Thai text using `toLocaleLowerCase("th-TH")` plus trimmed strings. Use the numeric `experience_years` for sorting.

- [ ] **Step 4: Make the route stateful without adding a second route**

Use client state for mode, query, filters, and active group. Mirror `mode` and `group` in URL search parameters so a selected tab can be shared. Default to browse mode with the first professional group active.

- [ ] **Step 5: Run the focused tests**

Run:

```powershell
npx vitest run tests/w16-filter.test.ts
```

Expected: PASS.

### Task 4: Build the product-specific UI

**Files:**
- Create: `components/mode-switcher.tsx`, `components/search-filters.tsx`, `components/professional-tabs.tsx`, `components/rate-table.tsx`, `components/markup-panel.tsx`, `components/empty-state.tsx`
- Modify: `app/page.tsx`, `app/globals.css`, `app/layout.tsx`
- Create: `tests/rate-table.test.tsx`

**Interfaces:**
- `ModeSwitcher` receives `mode` and `onChange(mode)`.
- `SearchFilters` receives options, `W16Filters`, and `onChange(filters)`.
- `ProfessionalTabs` receives `groups`, `activeGroup`, and `onChange(group)`.
- `RateTable` receives `rows` and `selectedDegree`; it renders desktop table and mobile cards.
- `MarkupPanel` receives `factors` and renders label, factor value, description, and source page.

- [ ] **Step 1: Write the failing table interaction tests**

Assert that the table renders the Thai column labels, that the selected degree applies an accessible selected state to the matching rate column, and that each row exposes its source page.

- [ ] **Step 2: Implement the page shell and mode switcher**

Create a calm editorial dashboard layout with the title “คู่มือเทียบราคาค่าจ้างที่ปรึกษา”, a short explanation, a compact summary of rows/groups, and two clear controls labeled “ค้นหา” and “ดูตามกลุ่มวิชาชีพ”.

- [ ] **Step 3: Implement search filters**

Render a text search, professional-group select, experience select, and degree select. Add an explicit “ล้างตัวกรอง” action and accessible labels. Keep the filter bar sticky below the page header.

- [ ] **Step 4: Implement professional-group tabs and rate table**

Render tabs using buttons with `role="tablist"` and `role="tab"`. In browse mode, render only the active group table. In search mode, render all matching rows with the matched group visible in each row. Display Thai-formatted currency with no invented calculations.

- [ ] **Step 5: Implement Markup Factor panel and empty/error states**

Place Markup Factor beside or below the table. Show a specific “ไม่มี Markup Factor ที่ผูกกับรายการนี้” message when no mapping exists. Add loading, no-result, and retry states without exposing implementation details.

- [ ] **Step 6: Apply the 60/30/10 visual system and responsive behavior**

Use warm off-white as the dominant surface, deep teal for structure and text hierarchy, and coral/orange for selected controls and key emphasis. Keep focus rings visible, preserve readable contrast, and switch tables to stacked cards under the mobile breakpoint.

- [ ] **Step 7: Run UI tests**

Run:

```powershell
npx vitest run tests/rate-table.test.tsx
```

Expected: PASS.

### Task 5: Connect data, validate, and hand off the working site

**Files:**
- Modify: `lib/w16-data.ts`, `app/page.tsx`, `app/layout.tsx`, `README.md`
- Modify: `package.json` if test scripts are needed

**Interfaces:**
- The page uses one data-loading boundary and does not expose service-role credentials.
- The page keeps the same UI whether the rows come from Supabase or local fixtures.

- [ ] **Step 1: Add explicit data-loading states**

Use the Supabase response error to render the retry state. Use local fixtures only when configuration is absent, and label local preview data in development so it cannot be mistaken for a connected production dataset.

- [ ] **Step 2: Set page metadata and remove starter content**

Set the title and description to the Thai product name and remove unused starter copy/icons that do not belong to the guide.

- [ ] **Step 3: Add the test and build scripts**

Ensure `package.json` contains:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "lint": "next lint",
    "test": "vitest run"
  }
}
```

- [ ] **Step 4: Run the complete verification**

Run:

```powershell
npm test
npm run lint
npm run build
```

Expected: all tests pass, lint has no errors, and production build completes.

- [ ] **Step 5: Run the local preview**

Run:

```powershell
npm run dev
```

Open the exact local URL printed by Next.js and verify the first viewport shows the product title, mode switcher, active group tab, table, and Markup Factor panel. Check one search interaction and one tab interaction at desktop and mobile widths.

- [ ] **Step 6: Document setup and data provenance**

README must explain the two modes, the required public Supabase variables, the seed command, the read-only policy, and that the table values retain PDF page/table references.
