// Core audit data types
export interface AuditProject {
  id: string;
  fy: string;
  auditNumber: string;
  isPaid?: boolean;
  companyName: string;
  location: string;
  district: string;
  sector: string;
  product: string;
  auditDate: string | null;
  auditDays: number;
  utilities: string;
  sanctionedDemand: number;
  // Baseline
  annualElecConsumptionKwh: number;
  annualEnergyConsumptionToe: number;
  annualEnergyCostInr: number;
  annualElecCostInr?: number;
  annualFuelCostInr?: number;
  existingCo2Tonnes: number;
  // Recommendations
  ecmRecommended: number;
  annualElecSavingsKwh: number;
  annualEnergySavingsToe?: number;
  annualSavingsInr: number;
  annualCo2ReductionTonnes: number;
  investmentInr: number;
  roiMonths: number;
  energySavingsPct?: number;
  // Implementation
  ecmImplemented?: number;
  actualInvestmentInr?: number;
  actualElecSavingsKwh?: number;
  actualEnergyCostSavingsInr?: number;
  actualCo2ReductionTonnes?: number;
  // Map
  coordinates: { lat: number; lng: number };
  implementationPct?: number;
  // Source (paid audits)
  sourceOfLead?: string;
}

export interface GrandTotals {
  totalAudits: number;
  totalPaidAudits: number;
  totalWalkthrough: number;
  totalClusters: number;
  totalSavingsInr: number;
  totalCo2ReductionTonnes: number;
  totalInvestmentInr: number;
  totalEcmRecommended: number;
  totalEcmImplemented: number;
  totalActualSavingsInr: number;
  totalActualCo2Tonnes: number;
  totalElecConsumptionKwh: number;
  totalEnergyCostInr: number;
  totalExistingCo2Tonnes: number;
  implementationPct: number;
}

export interface YearSummary {
  fy: string;
  auditCount: number;
  totalSavingsInr: number;
  totalCo2ReductionTonnes: number;
  totalInvestmentInr: number;
  totalEcmRecommended: number;
  totalEcmImplemented: number;
  implementationPct: number;
  actualSavingsInr: number;
  actualCo2Tonnes: number;
  elecSavingsKwh: number;
}

export interface SectorBreakdown {
  sector: string;
  count: number;
  totalSavingsInr: number;
  totalCo2Reduction: number;
  totalInvestment: number;
  totalEcmRecommended: number;
  totalEcmImplemented: number;
}

export interface KisemData {
  generated: string;
  grandTotals: GrandTotals;
  yearSummary: Record<string, YearSummary>;
  audits: AuditProject[];
  paidAudits: AuditProject[];
  sectorBreakdown: SectorBreakdown[];
  metricsRaw: Record<string, Record<string, number>>;
}
