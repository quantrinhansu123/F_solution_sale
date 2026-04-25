export interface Lead {
  id: string;
  name: string;
  phone: string;
  sourceId: string;
  status: 'New' | 'Qualified';
  evidenceUrl?: string;
  demoDate?: string;
  docsUrl?: string;
}

export interface Contract {
  id: string;
  value: number;
  status: 'Signed' | 'Paid';
  docUrl: string;
}

export const mockLeads: Lead[] = [
  { id: 'L001', name: 'Nguyễn Văn A', phone: '0901234567', sourceId: 'FB-ADS', status: 'Qualified', evidenceUrl: 'https://prnt.sc/example1' },
  { id: 'L002', name: 'Trần Thị B', phone: '0912345678', sourceId: 'GG-ADS', status: 'New' },
  { id: 'L003', name: 'Lê Văn C', phone: '0923456789', sourceId: 'REF', status: 'Qualified', evidenceUrl: 'https://prnt.sc/example2', demoDate: '2024-05-20 14:00', docsUrl: 'https://docs.google.com/doc1' },
  { id: 'L004', name: 'Phạm Thị D', phone: '0934567890', sourceId: 'TIKTOK', status: 'Qualified', demoDate: '2024-05-21 09:30' },
  { id: 'L005', name: 'Hoàng Văn E', phone: '0945678901', sourceId: 'GG-ADS', status: 'New' },
];

export const mockContracts: Contract[] = [
  { id: 'HD-2024-001', value: 20000000, status: 'Signed', docUrl: 'https://drive.google.com/file1' },
  { id: 'HD-2024-002', value: 15000000, status: 'Paid', docUrl: 'https://drive.google.com/file2' },
];
