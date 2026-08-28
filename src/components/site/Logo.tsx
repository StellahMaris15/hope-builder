import logoImage from "@/assets/logo.png";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("inline-flex items-center gap-3", className)}>
      <img
        src={logoImage}
        alt="Hope Alliance logo"
        className="h-12 w-auto drop-shadow-[0_6px_20px_rgba(0,0,0,0.2)]"
        loading="eager"
      />
      <span className="text-base font-semibold uppercase tracking-[0.24em] leading-none">
        <span className="text-accent">HOPE</span>{" "}
        <span className="text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]">ALLIANCE</span>
      </span>
    </Link>
  );
}
