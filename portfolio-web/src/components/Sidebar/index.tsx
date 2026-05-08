"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { FiLogOut } from "react-icons/fi";
import { AdminRoutes } from "@/routes";
import { RouteTypes } from "@/types/routesTypes";
import { useAuth } from "@/app/auth/AuthContext";
import { colorClasses } from "@/styles/theme";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const trigger = useRef<HTMLButtonElement | null>(null);
  const sidebar = useRef<HTMLElement | null>(null);
  const { signOut, user } = useAuth();

  const filteredRoutes = useMemo(
    () =>
      AdminRoutes.filter((route) => {
        if (route.requiredRoles.length === 0) return true;
        return user && route.requiredRoles.includes(user.role);
      }),
    [user],
  );

  const displayName = user?.role === "ADMIN" ? "Admin User" : user?.name || "Alex Rivera";
  const email = user?.email || (user?.role === "ADMIN" ? "Pro Plan Admin" : "alex@portfolio.pro");
  const accountLabel = user?.role === "ADMIN" ? "ADMIN CONSOLE" : "Pro Plan";

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target as Node) ||
        trigger.current.contains(target as Node)
      ) {
        return;
      }
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, [setSidebarOpen, sidebarOpen]);

  useEffect(() => {
    const keyHandler = ({ key }: KeyboardEvent) => {
      if (!sidebarOpen || key !== "Escape") return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  }, [setSidebarOpen, sidebarOpen]);

  return (
    <aside
      ref={sidebar}
      className={`fixed inset-y-0 left-0 z-9999 flex h-screen w-64 shrink-0 flex-col overflow-hidden border-r ${colorClasses.border} ${colorClasses.surfaceLow} transition-transform duration-200 lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="shrink-0 flex items-start justify-between px-6 py-6">
        <Link href="/dashboard">
          <span className={`block text-xl font-semibold ${colorClasses.primaryText}`}>PortfolioPro</span>
          <span className={`mt-1 block text-xs font-medium uppercase tracking-[0.08em] ${colorClasses.text}`}>
            {accountLabel}
          </span>
        </Link>

        <button
          ref={trigger}
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`rounded border ${colorClasses.border} px-2 py-1 ${colorClasses.text} lg:hidden`}
          aria-label="Close sidebar"
        >
          x
        </button>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {filteredRoutes.map((item: RouteTypes, index: number) => {
          const isActive = pathname === item.routeName && item.menuName === "Dashboard";
          const routeActive = pathname === item.routeName && item.menuName !== "Dashboard";

          return (
            <div key={`${item.menuName}-${index}`}>
              {item.menuHeading && (
                <h3 className={`mb-3 mt-6 px-4 text-[11px] font-semibold uppercase tracking-[0.16em] ${colorClasses.textSubtle} first:mt-0`}>
                  {item.menuHeading}
                </h3>
              )}
              <Link
                href={item.routeName}
                className={`mb-1.5 flex items-center gap-3 rounded-md px-4 py-2.5 text-sm transition ${
                  isActive || routeActive
                    ? `border-l-2 border-[#3525cd] ${colorClasses.surfaceSubtle} ${colorClasses.primaryText}`
                    : `${colorClasses.textMuted} hover:bg-[#e7e8e9] hover:text-[#191c1d]`
                }`}
              >
                {item.icon}
                {item.menuName}
              </Link>
            </div>
          );
        })}
      </nav>

      <div className="shrink-0 px-4 pb-5">
        <div className={`border-t ${colorClasses.border} pt-4`}>
          <div className="flex items-center justify-between gap-3 px-2">
            <div className="flex min-w-0 items-center gap-3">
              {user?.role === "ADMIN" ? (
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${colorClasses.primaryBg} text-sm font-semibold text-white`}>
                  JD
                </div>
              ) : (
                <Image
                  src="/images/user/user-01.png"
                  alt={displayName}
                  width={40}
                  height={40}
                  className="shrink-0 rounded-full"
                />
              )}
              <div className="min-w-0">
                <p className={`truncate text-sm font-semibold ${colorClasses.text}`}>{displayName}</p>
                <p className={`truncate text-xs ${colorClasses.textMuted}`}>{email}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={signOut}
              aria-label="Log out"
              title="Log out"
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${colorClasses.textMuted} hover:bg-[#e7e8e9] hover:text-[#ba1a1a]`}
            >
              <FiLogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
