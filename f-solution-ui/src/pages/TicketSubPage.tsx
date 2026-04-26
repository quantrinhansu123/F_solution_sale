import { useParams, Navigate } from 'react-router-dom';
import TicketOverview from '../components/ticket/TicketOverview';
import SpecificationTable from '../components/ticket/SpecificationTable';
import DevTaskTable from '../components/ticket/DevTaskTable';
import CSTab from '../components/ticket/CSTab';

const valid = new Set(['overview', 'ba', 'dev', 'cs']);

const TicketSubPage: React.FC = () => {
  const { sub } = useParams<{ sub: string }>();
  if (!sub || !valid.has(sub)) {
    return <Navigate to="/ticket/overview" replace />;
  }

  return (
    <div className="space-y-5">
      {sub === 'ba' && <SpecificationTable />}
      {sub === 'dev' && <DevTaskTable />}
      {sub === 'cs' && <CSTab />}
      {sub === 'overview' && <TicketOverview />}
    </div>
  );
};

export default TicketSubPage;
