"use client";
import { use } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Topbar } from "@/components/shell/Topbar";
import { FileText, Search, GitBranch } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  params: Promise<{ kbId: string }>;
}

export default function KBLayout({ children, params }: Props) {
  const { kbId } = use(params);
  const pathname = usePathname();

  const tabs = [
    { label: "Documents", href: `/kb/${kbId}`, icon: FileText },
    { label: "Query", href: `/kb/${kbId}/query`, icon: Search },
    { label: "Graph", href: `/kb/${kbId}/graph`, icon: GitBranch },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Knowledge Base" />
      <div className="flex items-center gap-1 px-6 pt-4 pb-0 border-b border-white/6">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all",
                active
                  ? "border-violet-500 text-white"
                  : "border-transparent text-white/40 hover:text-white/70"
              )}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </Link>
          );
        })}
      </div>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
