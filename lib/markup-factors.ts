import type { W16Degree, W16EvidenceCount, W16MarkupFactor, W16OrganizationType, W16PersonnelRole } from "@/lib/types";

export type MarkupFactorSelection = {
  organizationType: W16OrganizationType;
  personnelRole: W16PersonnelRole;
  evidenceCount: W16EvidenceCount;
};

export type PersonnelRoleSelection = "auto" | Exclude<W16PersonnelRole, "any">;

const mainStaffThresholds: Record<Exclude<W16Degree, never>, number> = {
  bachelor: 10,
  master: 5,
  doctorate: 2,
};

export function getPersonnelRole(degree: W16Degree | "all", experience: string) {
  if (degree === "all" || experience === "all") return null;

  const experienceYears = Number(experience);
  if (!Number.isFinite(experienceYears)) return null;

  return experienceYears >= mainStaffThresholds[degree] ? "main" : "assistant";
}

export function resolvePersonnelRole(
  selection: PersonnelRoleSelection,
  degree: W16Degree | "all",
  experience: string,
) {
  return selection === "auto" ? getPersonnelRole(degree, experience) : selection;
}

export function findMarkupFactor(factors: W16MarkupFactor[], selection: MarkupFactorSelection) {
  return factors.find((factor) => (
    factor.organization_type === selection.organizationType
    && (factor.personnel_role === selection.personnelRole || factor.personnel_role === "any")
    && (factor.evidence_count === selection.evidenceCount || factor.evidence_count === "any")
  ));
}
