import React, { type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import defaultHeroImage from "@/assets/hero-children.jpg";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
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
