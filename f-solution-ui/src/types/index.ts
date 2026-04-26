export type TabType = 'dashboard' | 'crm' | 'ticket' | 'income' | 'settings';
export type SubTabType = 'overview' | 'leads' | 'demo' | 'contracts' | 'ba' | 'dev' | 'cs' | null;

export interface MenuItem {
  id: TabType;
  label: string;
  icon: any;
  subItems?: { id: SubTabType; label: string }[];
}

export interface FinancialData {
  totalValue: number;
  profit: number;
  overheads: number;
  pool60: number;
  breakdown: DepartmentAllocation[];
}

export interface DepartmentAllocation {
  name: string;
  percentage: number;
  estimatedAmount: number;
  actualSpent: number;
}

export interface CRMStats {
  leads: { total: number; qualified: number; rate: number };
  demos: { count: number; bonus: number };
  contracts: { totalValue: number; fund31: number };
  funnel: FunnelStage[];
}

export interface FunnelStage {
  stage: string;
  value: number;
  rate: number;
}
