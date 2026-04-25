export interface Transaction {
  id: string;
  date: string;
  content: string;
  type: 'Dự án' | 'AMC' | 'Lead' | 'Bonus';
  amount: number;
  status: 'Thành công' | 'Chờ xử lý';
}

export const mockTransactions: Transaction[] = [
  { id: 'TX-001', date: '2024-05-20', content: 'Giải ngân 60% Ticket #DEV-001: Dashboard', type: 'Dự án', amount: 900000, status: 'Thành công' },
  { id: 'TX-002', date: '2024-05-18', content: 'Hoa hồng Qualified Lead: Nguyễn Văn A', type: 'Lead', amount: 30000, status: 'Thành công' },
  { id: 'TX-003', date: '2024-05-15', content: 'Phí xử lý Ticket AMC #SUP-101', type: 'AMC', amount: 500000, status: 'Thành công' },
  { id: 'TX-004', date: '2024-05-12', content: 'Giải ngân 20% UAT Ticket #DEV-002', type: 'Dự án', amount: 400000, status: 'Chờ xử lý' },
  { id: 'TX-005', date: '2024-05-10', content: 'Bonus dự án ERP nội bộ', type: 'Bonus', amount: 2000000, status: 'Thành công' },
  { id: 'TX-006', date: '2024-05-08', content: 'Giải ngân 60% Ticket #DEV-005', type: 'Dự án', amount: 720000, status: 'Thành công' },
  { id: 'TX-007', date: '2024-05-05', content: 'Hoa hồng chốt hợp đồng VinGroup', type: 'Lead', amount: 1500000, status: 'Thành công' },
];

export const incomeByRole = [
  { role: 'Lập trình (Dev)', amount: 4500000, color: 'bg-indigo-500' },
  { role: 'Marketing (Lead)', amount: 1800000, color: 'bg-emerald-500' },
  { role: 'Hỗ trợ (AMC)', amount: 1200000, color: 'bg-amber-500' },
];
