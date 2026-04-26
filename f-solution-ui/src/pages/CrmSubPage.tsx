import { useParams, Navigate } from 'react-router-dom';
import CRMOverview from '../components/crm/CRMOverview';
import LeadManagement from '../components/crm/LeadManagement';
import DemoManagement from '../components/crm/DemoManagement';
import ContractManagement from '../components/crm/ContractManagement';
import QuotationManagement from '../components/crm/QuotationManagement';

const valid = new Set(['overview', 'leads', 'demo', 'quotes', 'contracts']);

const CrmSubPage: React.FC = () => {
  const { sub } = useParams<{ sub: string }>();
  if (!sub || !valid.has(sub)) {
    return <Navigate to="/crm/overview" replace />;
  }

  return (
    <div className="space-y-5">
      {sub === 'leads' && <LeadManagement />}
      {sub === 'demo' && <DemoManagement />}
      {sub === 'quotes' && <QuotationManagement />}
      {sub === 'contracts' && <ContractManagement />}
      {sub === 'overview' && <CRMOverview />}
    </div>
  );
};

export default CrmSubPage;
