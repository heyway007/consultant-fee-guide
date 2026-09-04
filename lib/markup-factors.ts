import type { W16EvidenceCount, W16MarkupFactor, W16OrganizationType, W16PersonnelRole } from "@/lib/types";

export type MarkupFactorSelection = {
  organizationType: W16OrganizationType;
  personnelRole: W16PersonnelRole;
  evidenceCount: W16EvidenceCount;
};

export function findMarkupFactor(factors: W16MarkupFactor[], selection: MarkupFactorSelection) {
  return factors.find((factor) => (
    factor.organization_type === selection.organizationType
    && (factor.personnel_role === selection.personnelRole || factor.personnel_role === "any")
    && (factor.evidence_count === selection.evidenceCount || factor.evidence_count === "any")
  ));
}
