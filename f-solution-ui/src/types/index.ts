export type TabType = 'dashboard' | 'crm' | 'ticket' | 'income' | 'settings';
export type SubTabType = 'overview' | 'leads' | 'demo' | 'contracts' | 'ba' | 'dev' | 'cs' | null;

export interface MenuItem {
  id: TabType;
  label: string;
  icon: any;
  subItems?: { id: SubTabType; label: string }[];
}
