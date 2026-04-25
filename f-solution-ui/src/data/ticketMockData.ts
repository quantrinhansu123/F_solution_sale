export interface Ticket {
  id: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Reopened';
  deadline: string;
  reopenCount: number;
  assignee: string;
}

export interface Specification {
  id: string;
  feature: string;
  srsUrl: string;
  figmaUrl: string;
  points: number;
  status: 'Drafting' | 'Approved';
}

export interface DevTask {
  id: string;
  title: string;
  points: number;
  prUrl?: string;
  status: 'Todo' | 'In Progress' | 'Review' | 'Done';
  disbursement: {
    coding: boolean;
    uat: boolean;
    live: boolean;
  };
}

export interface Deployment {
  id: string;
  projectName: string;
  customer: string;
  finishDate: string;
  docsUrl?: string;
  status: 'Waiting' | 'Go-live';
}

export interface SupportTicket {
  id: string;
  content: string;
  amcPoints: number;
  processTime: string;
  status: 'Pending' | 'Completed';
}

export const hotTickets: Ticket[] = [
  { id: 'TIC-001', title: 'Lỗi đồng bộ dữ liệu thanh toán', priority: 'High', status: 'Reopened', deadline: '2024-05-18', reopenCount: 3, assignee: 'Lê Văn A' },
  { id: 'TIC-005', title: 'Giao diện mobile bị vỡ layout', priority: 'High', status: 'Open', deadline: '2024-05-15', reopenCount: 0, assignee: 'Nguyễn Thị B' },
  { id: 'TIC-012', title: 'API trả về lỗi 500 khi upload file', priority: 'Medium', status: 'Reopened', deadline: '2024-05-19', reopenCount: 2, assignee: 'Trần Văn C' },
  { id: 'TIC-008', title: 'Thiếu trường thông tin trong báo cáo', priority: 'Medium', status: 'Open', deadline: '2024-05-14', reopenCount: 1, assignee: 'Phạm Văn D' },
  { id: 'TIC-020', title: 'Performance chậm tại trang Dashboard', priority: 'High', status: 'In Progress', deadline: '2024-05-16', reopenCount: 0, assignee: 'Hoàng Thị E' },
];

export const projectProgress = [
  { stage: 'Thiết kế (BA)', progress: 85, color: 'bg-indigo-500' },
  { stage: 'Lập trình (Dev)', progress: 65, color: 'bg-blue-500' },
  { stage: 'Triển khai (CS)', progress: 30, color: 'bg-slate-500' },
];

export const mockSpecifications: Specification[] = [
  { id: 'SPEC-001', feature: 'Hệ thống Đăng nhập & Phân quyền SSO', srsUrl: 'https://docs.google.com/srs1', figmaUrl: 'https://figma.com/file1', points: 12, status: 'Approved' },
  { id: 'SPEC-002', feature: 'Module CRM - Quản lý Lead & Funnel', srsUrl: 'https://docs.google.com/srs2', figmaUrl: 'https://figma.com/file2', points: 25, status: 'Drafting' },
  { id: 'SPEC-003', feature: 'Báo cáo Tài chính Real-time', srsUrl: 'https://docs.google.com/srs3', figmaUrl: 'https://figma.com/file3', points: 18, status: 'Approved' },
  { id: 'SPEC-004', feature: 'Tích hợp Cổng thanh toán VNPay/Momo', srsUrl: 'https://docs.google.com/srs4', figmaUrl: 'https://figma.com/file4', points: 15, status: 'Drafting' },
  { id: 'SPEC-005', feature: 'Hệ thống Thông báo (Push Notification)', srsUrl: 'https://docs.google.com/srs5', figmaUrl: 'https://figma.com/file5', points: 8, status: 'Approved' },
];

export const mockDevTasks: DevTask[] = [
  { id: 'DEV-001', title: 'Xây dựng Dashboard tài chính', points: 15, prUrl: 'https://github.com/pr/1', status: 'Done', disbursement: { coding: true, uat: true, live: true } },
  { id: 'DEV-002', title: 'API tích hợp VNPay', points: 20, prUrl: 'https://github.com/pr/2', status: 'Review', disbursement: { coding: true, uat: true, live: false } },
  { id: 'DEV-003', title: 'UI Quản lý Lead', points: 10, prUrl: 'https://github.com/pr/3', status: 'In Progress', disbursement: { coding: true, uat: false, live: false } },
  { id: 'DEV-004', title: 'Fix lỗi CSS Mobile', points: 5, status: 'Todo', disbursement: { coding: false, uat: false, live: false } },
  { id: 'DEV-005', title: 'Đặc tả hệ thống phân quyền', points: 12, prUrl: 'https://github.com/pr/5', status: 'Done', disbursement: { coding: true, uat: true, live: false } },
];

export const mockDeployments: Deployment[] = [
  { id: 'DP-001', projectName: 'ERP nội bộ F-Solution', customer: 'F-Solution Corp', finishDate: '2024-05-15', status: 'Waiting' },
  { id: 'DP-002', projectName: 'App Mobile Bán hàng', customer: 'VinGroup', finishDate: '2024-05-10', docsUrl: 'https://docs.google.com/handover1', status: 'Go-live' },
];

export const mockSupportTickets: SupportTicket[] = [
  { id: 'SUP-101', content: 'Lỗi không đăng nhập được App', amcPoints: 5, processTime: '30m', status: 'Completed' },
  { id: 'SUP-102', content: 'Cập nhật logo mới trên website', amcPoints: 2, processTime: '1h', status: 'Pending' },
  { id: 'SUP-103', content: 'Hướng dẫn sử dụng module CRM', amcPoints: 8, processTime: '2h', status: 'Completed' },
];
