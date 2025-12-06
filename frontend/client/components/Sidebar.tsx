import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Sword,
  Plus,
  DollarSign,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Players", icon: Users, path: "/players" },
  { label: "Matches", icon: Sword, path: "/matches" },
  { label: "Create Match", icon: Plus, path: "/create-match" },
  { label: "Payments", icon: DollarSign, path: "/payments" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

export default function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "bg-[#0D0D0F] border-r border-[#2A2A2D] flex flex-col transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Top Section */}
      <div className="p-6 border-b border-[#2A2A2D] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-primary" />
          {!collapsed && (
            <div>
              <h1 className="text-2xl font-bold text-primary font-sans">
                FM Manager
              </h1>
              <p className="text-xs text-muted-foreground">
                Dark Hunters Guild
              </p>
            </div>
          )}
        </div>

        {/* Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-sidebar-accent text-muted-foreground transition"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-primary/10 border border-primary text-primary glow-gold-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
              )}
            >
              <Icon className="w-5 h-5" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#2A2A2D] text-center text-xs text-muted-foreground">
        {!collapsed && "v1.0.0"}
      </div>
    </aside>
  );
}
