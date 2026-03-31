import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Flame } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCallerProfile } from "../hooks/useQueries";

type Tab = "dashboard" | "admin" | "user" | "tracker";

interface HeaderProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
  const { login, clear, identity, loginStatus } = useInternetIdentity();
  const { data: profile } = useCallerProfile();
  const isLoggingIn = loginStatus === "logging-in";

  const navItems: { id: Tab; label: string }[] = [
    { id: "dashboard", label: "Dashboard" },
    { id: "admin", label: "Admin" },
    { id: "user", label: "My Tasks" },
    { id: "tracker", label: "Tracker" },
  ];

  return (
    <header className="sticky top-0 z-50">
      {/* Primary nav */}
      <div className="bg-header border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onTabChange("dashboard")}
            className="flex items-center gap-2 group"
            data-ocid="header.link"
          >
            <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center">
              <Flame className="w-4 h-4 text-[oklch(0.12_0_0)]" />
            </div>
            <span className="font-display text-xl font-bold text-gold">
              ScriptureFlow
            </span>
          </button>

          <nav
            className="hidden md:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {navItems.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => onTabChange(item.id)}
                data-ocid={`nav.${item.id}.link`}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? "bg-gold/10 text-gold border border-gold/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {identity ? (
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8 border border-gold/40">
                  <AvatarFallback className="bg-gold/20 text-gold text-xs">
                    {profile?.name?.charAt(0)?.toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground hidden md:block">
                  {profile?.name ?? "User"}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clear}
                  className="text-muted-foreground hover:text-foreground text-xs"
                  data-ocid="header.logout.button"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={login}
                disabled={isLoggingIn}
                className="bg-gold text-[oklch(0.12_0_0)] hover:bg-gold-dim font-semibold"
                data-ocid="header.login.button"
              >
                {isLoggingIn ? "Connecting..." : "Sign In"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile secondary nav */}
      <div className="bg-secondary-nav border-b border-border md:hidden">
        <div className="flex overflow-x-auto">
          {navItems.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex-shrink-0 px-4 py-2 text-xs font-medium transition-colors ${
                activeTab === item.id
                  ? "text-gold border-b-2 border-gold"
                  : "text-muted-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
