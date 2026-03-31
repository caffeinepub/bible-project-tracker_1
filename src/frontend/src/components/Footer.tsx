import { Flame } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="bg-header border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-gold" />
            <span className="font-display text-gold font-semibold">
              ScriptureFlow
            </span>
            <span className="text-muted-foreground text-sm ml-2">
              © {year} Bible Production Tracker
            </span>
          </div>
          <a
            href={utmLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-gold text-sm transition-colors"
          >
            Built with ❤️ using caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
