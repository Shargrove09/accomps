"use client";

import { usePathname } from "next/navigation";

/** Nav chrome; client-only to read the route, children stay server-rendered. */
export function AppShell({ children }: { children: React.ReactNode }) {
  // Login sits outside the shell: page padding would stack on its min-h-screen.
  if (usePathname() === "/login") return <>{children}</>;

  return (
    <div className="min-h-screen">
      <nav className="bg-east-bay shadow-sm border-b border-kimberly">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* ml-16 clears the fixed hamburger at top-4 left-4. */}
            <div className="flex items-center ml-16">
              <p className="text-xl font-bold text-mischka">
                Accomplishments Tracker
              </p>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
