/** Tiêu đề header theo URL */
export function getPageTitleFromPathname(pathname: string): string {
  if (pathname === '/dashboard' || pathname === '/' || pathname === '') {
    return 'Financial Overview';
  }
  if (pathname.startsWith('/crm/')) {
    const sub = pathname.split('/')[2];
    switch (sub) {
      case 'leads':
        return 'Quản lý Leads';
      case 'demo':
        return 'Cơ hội & Demo';
      case 'contracts':
        return 'Quản lý Hợp đồng';
      case 'overview':
      default:
        return 'Tổng quan CRM';
    }
  }
  if (pathname === '/crm') {
    return 'Tổng quan CRM';
  }
  if (pathname.startsWith('/ticket/')) {
    const sub = pathname.split('/')[2];
    switch (sub) {
      case 'ba':
        return 'BA & Đặc tả';
      case 'dev':
        return 'Phát triển (Dev)';
      case 'cs':
        return 'Triển khai (CS)';
      case 'overview':
      default:
        return 'Tổng quan Ticket';
    }
  }
  if (pathname === '/ticket') {
    return 'Tổng quan Ticket';
  }
  if (pathname === '/income') {
    return 'Income Statements';
  }
  if (pathname === '/settings') {
    return 'System Settings';
  }
  return 'Dashboard';
}
