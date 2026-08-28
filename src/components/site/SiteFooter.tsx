import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { Logo } from "./Logo";
import { NewsletterSignup } from "./NewsletterSignup";

export function SiteFooter() {
  return (
    <footer className="bg-primary-deep text-primary-foreground">
      <NewsletterSignup />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm text-primary-foreground/70">
            A faith-driven organization empowering communities through education, mentorship,
            charity and spiritual ministry.
          </p>
          <div className="flex gap-2">
            {[Facebook, Twitter, Instagram].map((Icon, i) => (
              <span
                key={i}
                className="grid size-9 place-items-center rounded-full bg-white/10 text-primary-foreground"
              >
                <Icon className="size-4" />
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-accent">Explore</h3>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            {[
              { label: "About Us", to: "/about" },
              { label: "Our Programs", to: "/programs" },
              { label: "Our Impact", to: "/impact" },
              { label: "Events", to: "/events" },
              { label: "Blog", to: "/blog" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="transition-colors hover:text-accent">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-accent">
            Get Involved
          </h3>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            {[
              { label: "Donate", to: "/donate" },
              { label: "Volunteer", to: "/get-involved" },
              { label: "Become a Mentor", to: "/get-involved" },
              { label: "Prayer Requests", to: "/get-involved" },
              { label: "Contact Us", to: "/contact" },
            ].map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="transition-colors hover:text-accent">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-accent">Contact</h3>
          <ul className="space-y-3 text-sm text-primary-foreground/70">
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-accent" />
              +256 700 123 456
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-accent" />
              info@hopealliance.org
            </li>
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
              133 Hope Avenue, Kampala, Uganda
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-primary-foreground/55 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} Hope Alliance. All rights reserved.</p>
          <Link to="/auth" className="transition-colors hover:text-accent">
            Staff Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
