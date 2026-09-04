export type W16Degree = "bachelor" | "master" | "doctorate";

export type W16Mode = "browse" | "search";

export type W16OrganizationType = "company-association" | "government" | "independent";
export type W16PersonnelRole = "main" | "assistant" | "any";
export type W16EvidenceCount = "3" | "2" | "1" | "0" | "any";

export type W16Filters = {
  query: string;
  professionalGroup: string;
  experience: string;
  degree: W16Degree | "all";
};

export type W16RateRow = {
  id: string;
  professional_group: string;
  experience_years: number;
  experience_label: string;
  bachelor_rate: number | null;
  master_rate: number | null;
  doctorate_rate: number | null;
  source_page: number | null;
  source_table: string | null;
  notes: string | null;
};

export type W16MarkupFactor = {
  id: string;
  factor_type: string;
  organization_type: W16OrganizationType;
  personnel_role: W16PersonnelRole;
  evidence_count: W16EvidenceCount;
  factor_label: string;
  factor_value: number;
  description: string | null;
  source_page: number | null;
  sort_order: number;
};

export type W16SupportStaff = {
  id: string;
  position: string;
  monthly_rate: number;
  source_page: number | null;
  source_table: string | null;
};
