import type { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { getPageTitleFromPathname } from '../navigation/paths';

const MainLayout: FC = () => {
  const { pathname } = useLocation();
  const title = getPageTitleFromPathname(pathname);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <Header title={title} />
        <div className="p-5 space-y-5">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
