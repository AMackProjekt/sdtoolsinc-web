import { memo } from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
};

export const SectionHeading = memo(function SectionHeading({
  eyebrow,
  title,
  subtitle
}: SectionHeadingProps) {
  return (
    <div className="mx-auto max-w-[760px] text-center">
      {eyebrow && (
        <div className="mb-3 text-xs font-semibold tracking-[0.18em] text-muted uppercase">
          {eyebrow}
        </div>
      )}
      <h2 className="h2">{title}</h2>
      {subtitle && <p className="mt-4 p-lead">{subtitle}</p>}
    </div>
  );
});
