export function SectionHeading({
  title,
  align = "center",
}: {
  title: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <h2 className="section-title text-2xl text-foreground sm:text-3xl">{title}</h2>
      <span
        className={`mt-3 block h-1 w-16 rounded-full bg-accent ${align === "center" ? "mx-auto" : ""}`}
      />
    </div>
  );
}
