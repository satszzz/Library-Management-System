import { Outlet } from 'react-router-dom';
import DashboardSidebar from '../components/common/DashboardSidebar';
import BottomNavigation from '../components/common/BottomNavigation';

const StudentLayout = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <div className="flex min-h-screen bg-surface-50 dark:bg-surface-950">
      {/* Desktop Sidebar */}
      <DashboardSidebar onLogout={handleLogout} />

      {/* Main Content */}
      <main className="flex-1 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-8 pb-24 md:pb-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <BottomNavigation />
    </div>
  );
};

export default StudentLayout;
