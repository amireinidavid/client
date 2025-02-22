"use client";

import SuperAdminSidebar from "@/components/super-admin/sidebar/sidebar";
// import SuperAdminSidebar from "@/components/super-admin/sidebar";
import { cn } from "@/lib/utils";
import { useState } from "react";

function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <SuperAdminSidebar
        isOpen={isSidebarOpen}
        toggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <main
        className={cn(
          "transition-all duration-300 p-8",
          isSidebarOpen ? "ml-[280px]" : "ml-[72px]",
          "min-h-screen"
        )}
      >
        {children}
      </main>
    </div>
  );
}

export default SuperAdminLayout;
