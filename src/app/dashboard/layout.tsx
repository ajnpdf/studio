import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { DashboardTopBar } from '@/components/dashboard/dashboard-top-bar';
import { DashboardRightPanel } from '@/components/dashboard/dashboard-right-panel';
import { NightSky } from '@/components/dashboard/night-sky';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex text-foreground relative">
      <NightSky />
      <DashboardSidebar />
      <div className="flex-1 flex flex-col ml-64 transition-all duration-300">
        <DashboardTopBar />
        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
          <DashboardRightPanel />
        </div>
      </div>
    </div>
  );
}
