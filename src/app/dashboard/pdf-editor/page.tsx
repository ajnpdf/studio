
"use client";

import { PDFEditor } from '@/components/dashboard/pdf-editor/pdf-editor';
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { DashboardTopBar } from '@/components/dashboard/dashboard-top-bar';

export default function PDFEditorPage() {
  return (
    <div className="flex h-screen bg-transparent overflow-hidden font-body">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64 transition-all duration-500">
        <DashboardTopBar />
        <main className="flex-1 relative overflow-hidden">
          <PDFEditor initialFileId={null} />
        </main>
      </div>
    </div>
  );
}
