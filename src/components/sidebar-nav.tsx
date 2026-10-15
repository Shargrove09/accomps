"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Calendar,
  Tag,
  Folder,
  X,
  Menu,
  ListChecks,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { drawerClose, focusRing } from "@/lib/ui";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/accomplishments", label: "All Accomplishments", icon: ListChecks },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/categories", label: "Categories", icon: Folder },
  { href: "/tags", label: "Tags", icon: Tag },
];

export function SidebarNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const openButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  // Escape closes; focus moves into the drawer and back out.
  useEffect(() => {
    if (!isOpen) return;
    const opener = openButton.current;
    closeButton.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      opener?.focus();
    };
  }, [isOpen]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        // Redirect to login page
        router.push("/login");
        router.refresh();
      } else {
        console.error("Logout failed");
        setIsLoggingOut(false);
      }
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  // The sign-in screen is outside the app shell.
  if (pathname === "/login") return null;

  return (
    <>
      {/* Hamburger: fades out while open (the drawer has its own X) but stays mounted for focus return */}
      <button
        ref={openButton}
        onClick={toggleSidebar}
        className={cn(
          "fixed top-4 left-4 z-50 p-2 rounded-md bg-east-bay hover:bg-ebony-clay transition-all shadow-lg border border-kimberly hover:cursor-pointer",
          focusRing,
          isOpen && "pointer-events-none opacity-0"
        )}
        aria-label="Open menu"
        aria-expanded={isOpen}
        aria-controls="sidebar-nav"
        tabIndex={isOpen ? -1 : 0}
      >
        <Menu className="h-6 w-6 text-mischka" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 transition-opacity"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar — inert while closed so its links leave the tab order */}
      <aside
        id="sidebar-nav"
        inert={!isOpen}
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-east-bay shadow-xl z-40 transform transition-transform duration-300 ease-in-out border-r border-kimberly",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-kimberly">
            <h2 className="text-xl font-bold text-mischka">Navigation</h2>
            <button
              ref={closeButton}
              onClick={closeSidebar}
              className={drawerClose}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
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
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-east-bay",
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
          <div className="p-4 border-t border-kimberly space-y-3">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full group",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-east-bay",
                "text-red-400 hover:bg-red-900/20 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">
                {isLoggingOut ? "Logging out..." : "Logout"}
              </span>
            </button>
            <p className="text-xs text-kimberly text-center">
              Accomplishments Tracker
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
