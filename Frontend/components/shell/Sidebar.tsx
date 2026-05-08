"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Database, Search, GitBranch, FileText, Shield, LogOut, Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/stores/auth";
import { useRouter } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  adminOnly?: boolean;
}

const NAV: NavItem[] = [
  { label: "Knowledge Bases", href: "/dashboard", icon: Home },
  { label: "Admin", href: "/admin", icon: Shield, adminOnly: true },
];

export function Sidebar({ kbId }: { kbId?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const kbNav: NavItem[] = kbId
    ? [
        { label: "Documents", href: `/kb/${kbId}`, icon: FileText },
        { label: "Query", href: `/kb/${kbId}/query`, icon: Search },
        { label: "Graph", href: `/kb/${kbId}/graph`, icon: GitBranch },
      ]
    : [];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside className="flex h-full w-56 flex-col glass border-r border-white/6">
      {/* Logo */}
      <div className="flex h-14 items-center px-5 border-b border-white/6">
        <span className="text-lg font-bold gradient-text tracking-tight">NEXUS</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {/* Main nav */}
        {NAV.filter((n) => !n.adminOnly || user?.role === "admin").map((item) => (
          <SidebarItem key={item.href} item={item} active={pathname === item.href} />
        ))}

        {/* KB-specific nav */}
        {kbNav.length > 0 && (
          <>
            <div className="mx-2 my-3 border-t border-white/6" />
            <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-white/25">
              Current KB
            </p>
            {kbNav.map((item) => (
              <SidebarItem key={item.href} item={item} active={pathname === item.href} />
            ))}
          </>
        )}
      </nav>

      {/* User footer */}
      <div className="border-t border-white/6 p-3">
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-500/30 text-violet-300 text-xs font-semibold">
            {user?.full_name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white/80 truncate">{user?.full_name}</p>
            <p className="text-[10px] text-white/35 truncate">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1 text-white/30 hover:text-white/70 transition-colors"
            title="Sign out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}

function SidebarItem({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all",
        active
          ? "bg-gradient-to-r from-violet-600/25 to-cyan-500/15 text-white shadow-sm"
          : "text-white/50 hover:bg-white/5 hover:text-white/80"
      )}
    >
      <item.icon className="h-4 w-4 shrink-0" />
      {item.label}
    </Link>
  );
}
