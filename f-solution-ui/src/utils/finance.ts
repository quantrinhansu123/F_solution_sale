import { supabase } from '../supabase';
import type { FinancialData, DepartmentAllocation } from '../types';

function errText(e: { code?: string; message?: string; hint?: string; details?: string } | null): string {
  if (!e) return '';
  return [e.code, e.message, e.hint, e.details].filter(Boolean).join(' — ') || 'Unknown error';
}

const DEPARTMENTS = [
  { name: 'Marketing', percentage: 0.025, source: 'lead' },
  { name: 'Sale', percentage: 0.32, source: 'demo' },
  { name: 'SA/BA', percentage: 0.08, source: 'ba_comm' },
  { name: 'Product', percentage: 0.12, source: 'prod_comm' },
  { name: 'Development', percentage: 0.37, source: 'dev_ticket' },
  { name: 'Implementation (CS)', percentage: 0.10, source: 'cs_ticket' },
];

export async function fetchProjectFinancials(projectId: string): Promise<FinancialData> {
  try {
    // 1. Lấy total_value: luôn dùng dạng mảng (không .single()/.maybeSingle()) — tránh PGRST116
    // Nếu nhiều bản ghi cùng project_id, cộng dồn giá trị (có thể đổi thành chỉ lấy bản mới nhất tùy nghiệp vụ)
    const { data: contractRows, error: contractError } = await supabase
      .from('contracts')
      .select('total_value')
      .eq('project_id', projectId);

    if (contractError) console.error('Lỗi lấy hợp đồng:', errText(contractError));

    const totalValue = (contractRows || []).reduce(
      (s, r) => s + Number(r.total_value || 0),
      0
    );

    // 2. Lấy chi phí thực tế từ earnings_logs để so sánh
    const { data: logs, error: logsError } = await supabase
      .from('earnings_logs')
      .select('source_type, amount')
      .eq('project_id', projectId);

    if (logsError) console.error('Lỗi lấy log thu nhập:', errText(logsError));

    // Tính toán các hằng số theo công thức
    const profit = totalValue * 0.3;
    const overheads = totalValue * 0.1;
    const pool60 = totalValue * 0.6; // Hoặc totalValue - profit - overheads

    // Mapping mảng breakdown cho bảng giao diện
    const breakdown: DepartmentAllocation[] = DEPARTMENTS.map(dept => {
      // Tính toán số tiền thực tế đã chi dựa trên source_type
      const actualSpent = logs
        ? logs
            .filter(log => log.source_type === dept.source)
            .reduce((sum, log) => sum + Number(log.amount), 0)
        : 0;

      return {
        name: dept.name,
        percentage: dept.percentage * 100,
        estimatedAmount: pool60 * dept.percentage,
        actualSpent: actualSpent
      };
    });

    return { totalValue, profit, overheads, pool60, breakdown };
  } catch (err) {
    console.error('Lỗi hệ thống tài chính:', err);
    return {
      totalValue: 0,
      profit: 0,
      overheads: 0,
      pool60: 0,
      breakdown: DEPARTMENTS.map(d => ({ name: d.name, percentage: d.percentage * 100, estimatedAmount: 0, actualSpent: 0 }))
    };
  }
}
