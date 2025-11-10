"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, Tag, X, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/tags", label: "Tags", icon: Tag },
];

export function SidebarNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Hamburger Menu Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-east-bay hover:bg-ebony-clay transition-colors shadow-lg border border-kimberly"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-mischka" />
        ) : (
          <Menu className="h-6 w-6 text-mischka" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 transition-opacity"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-east-bay shadow-xl z-40 transform transition-transform duration-300 ease-in-out border-r border-kimberly",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-kimberly">
            <h2 className="text-xl font-bold text-mischka">Navigation</h2>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={closeSidebar}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group",
                        isActive
                          ? "bg-ebony-clay text-mischka shadow-md"
                          : "text-kimberly hover:bg-ebony-clay/50 hover:text-mischka"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-5 w-5",
                          isActive
                            ? "text-mischka"
                            : "text-kimberly group-hover:text-mischka"
                        )}
                      />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-kimberly">
            <p className="text-xs text-kimberly text-center">
              Accomplishments Tracker
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
