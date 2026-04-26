import { supabase } from '../supabase';
import type { CRMStats } from '../types';

export async function fetchCRMOverview(): Promise<CRMStats> {
  const now = new Date();
  // Lấy ngày đầu tiên của tháng hiện tại để lọc dữ liệu
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  try {
    // 1. Fetch Leads (Marketing)
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('status')
      .gte('created_at', firstDayOfMonth);

    if (leadsError) throw leadsError;

    const totalLeads = leads?.length || 0;
    const qualifiedLeads = leads?.filter(l => l.status === 'qualified').length || 0;

    // 2. Fetch Demos (Sales Activities)
    const { data: demos, error: demosError } = await supabase
      .from('sales_activities')
      .select('status')
      .eq('type', 'demo')
      .eq('status', 'completed')
      .gte('created_at', firstDayOfMonth);

    if (demosError) throw demosError;

    const demoCount = demos?.length || 0;

    // 3. Fetch Contracts (Closed Deals)
    const { data: contracts, error: contractsError } = await supabase
      .from('contracts')
      .select('total_value')
      .eq('status', 'signed')
      .gte('created_at', firstDayOfMonth);

    if (contractsError) throw contractsError;

    const totalContractValue = contracts?.reduce((sum, c) => sum + Number(c.total_value), 0) || 0;

    // Tính toán dữ liệu Phễu (Funnel)
    const funnel = [
      { 
        stage: 'Leads', 
        value: totalLeads, 
        rate: 100 
      },
      { 
        stage: 'Qualified', 
        value: qualifiedLeads, 
        rate: totalLeads ? (qualifiedLeads / totalLeads) * 100 : 0 
      },
      { 
        stage: 'Demo', 
        value: demoCount, 
        rate: qualifiedLeads ? (demoCount / qualifiedLeads) * 100 : 0 
      },
      { 
        stage: 'Closed', 
        value: contracts?.length || 0, 
        rate: demoCount ? ((contracts?.length || 0) / demoCount) * 100 : 0 
      },
    ];

    return {
      leads: { 
        total: totalLeads, 
        qualified: qualifiedLeads, 
        rate: totalLeads ? (qualifiedLeads / totalLeads) * 100 : 0 
      },
      demos: { 
        count: demoCount, 
        bonus: demoCount * 50000 
      },
      contracts: { 
        totalValue: totalContractValue, 
        fund31: totalContractValue * 0.31 
      },
      funnel
    };
  } catch (err) {
    console.error('Lỗi khi fetch dữ liệu CRM:', err);
    return {
      leads: { total: 0, qualified: 0, rate: 0 },
      demos: { count: 0, bonus: 0 },
      contracts: { totalValue: 0, fund31: 0 },
      funnel: [
        { stage: 'Leads', value: 0, rate: 0 },
        { stage: 'Qualified', value: 0, rate: 0 },
        { stage: 'Demo', value: 0, rate: 0 },
        { stage: 'Closed', value: 0, rate: 0 },
      ]
    };
  }
}
