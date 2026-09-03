import React, { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import defaultHeroImage from "@/assets/hero-children.jpg";
import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export function SiteShell({ children }: { children: ReactNode }) {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setShowBackToTop(window.scrollY > 360);

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        className={cn(
          "group fixed bottom-5 right-5 z-50 grid size-12 place-items-center rounded-full border border-white/20 bg-primary-deep/90 text-primary-foreground shadow-[0_12px_35px_-12px_rgba(0,0,0,0.7)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:bottom-7 sm:right-7 sm:size-14",
          showBackToTop
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0",
        )}
      >
        <ChevronUp className="size-5 transition-transform duration-300 group-hover:-translate-y-0.5 sm:size-6" />
      </button>
    </div>
  );
}

export function PageHero({
  title,

  image,
  description,
  actions,
  children,
}: {
  title: string;
  image?: string;
  description?: string;
  actions?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-primary-deep min-h-[55vh] sm:min-h-[60vh] lg:min-h-[75vh]">
      <img
        src={image ?? defaultHeroImage}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover object-center sm:object-right"
        loading="eager"
      />
      <div className="hero-overlay absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-extrabold leading-[1.08] text-primary-foreground sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-6 max-w-2xl text-base leading-8 text-primary-foreground/80">
              {description}
            </p>
          ) : null}
          {actions ? (
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {React.Children.map(actions, (child, i) => (
                <div key={i} className="w-full">
                  {React.isValidElement<{ className?: string }>(child)
                    ? React.cloneElement(child, {
                        className: cn(child.props.className, "w-full"),
                      })
                    : child}
                </div>
              ))}
            </div>
          ) : null}
          {children ? <div className="mt-8">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}
