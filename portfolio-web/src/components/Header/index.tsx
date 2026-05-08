"use client";

import { FiBell, FiHelpCircle, FiMenu, FiPlus, FiSearch } from "react-icons/fi";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/auth/AuthContext";
import { colorClasses } from "@/styles/theme";
import { componentStyles, cx } from "@/styles/ui";

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  const { user } = useAuth();
  const pathname = usePathname();
  const placeholder =
    pathname.startsWith("/user-management")
      ? "Search users, emails, or IDs..."
      : pathname.startsWith("/portfolios")
      ? "Search portfolios or users..."
      : pathname.startsWith("/templates")
      ? "Search templates..."
      : pathname.startsWith("/category")
      ? "Search categories..."
      : user?.role === "ADMIN"
        ? "Search accounts, portfolios, or logs..."
        : "Search projects, resumes, or assets...";

  return (
    <header className={`sticky top-0 z-30 border-b ${colorClasses.border} bg-white`}>
      <div className="flex h-20 items-center justify-between gap-6 px-6 lg:px-10">
        <button
          type="button"
          aria-label="Open sidebar"
          onClick={(event) => {
            event.stopPropagation();
            props.setSidebarOpen(!props.sidebarOpen);
          }}
          className={`rounded-md border ${colorClasses.border} p-2 ${colorClasses.text} lg:hidden`}
        >
          <FiMenu size={22} />
        </button>

        <div className="relative w-full max-w-xl">
          <FiSearch
            size={22}
            className={`absolute left-5 top-1/2 -translate-y-1/2 ${colorClasses.textMuted}`}
          />
          <input
            type="text"
            placeholder={placeholder}
            className={cx("h-11 w-full pl-14 pr-4", componentStyles.input)}
          />
        </div>

        <div className="flex shrink-0 items-center gap-5">
          <button type="button" className={`relative ${colorClasses.text} ${colorClasses.hoverText}`}>
            <FiBell size={24} />
            {pathname.startsWith("/user-management") && (
              <span className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full bg-red" />
            )}
          </button>
          <button type="button" className={`${colorClasses.text} ${colorClasses.hoverText}`}>
            <FiHelpCircle size={24} />
          </button>
          {pathname.startsWith("/user-management") ? (
            <Image
              src="/images/user/user-01.png"
              alt={user?.name || "Admin user"}
              width={42}
              height={42}
              className="rounded-full"
            />
          ) :  null }
        </div>
      </div>
    </header>
  );
};

export default Header;
