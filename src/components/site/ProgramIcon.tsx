import {
  Church,
  GraduationCap,
  HeartHandshake,
  Megaphone,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";

const MAP: Record<string, typeof Sparkles> = {
  "graduation-cap": GraduationCap,
  users: Users,
  megaphone: Megaphone,
  "heart-handshake": HeartHandshake,
  church: Church,
  wrench: Wrench,
};

export function ProgramIcon({ name, className }: { name: string; className?: string }) {
  const Icon = MAP[name] ?? Sparkles;
  return <Icon className={className} />;
}
