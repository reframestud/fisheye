import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/Button";
import { TeamProofRow } from "@/components/TeamProofRow";
import { site, pillars } from "@/content/site";
import { antiOrphan } from "@/lib/typography";

export const metadata: Metadata = {
  title: "Studio",
  description:
    "FISHEYE Architecture & Design: Marbella interior studio since 2009 — beliefs, built work, and how to reach us.",
};

const beliefPillars = pillars.slice(0, 3);

/** Studio hero only — intentionally omitted from `team.json` / TeamProofRow. */
const studioHeroFounder = {
  name: "Aleksandr Kuznetsov",
  role: "Head and founder",
  photo: "/images/team/01-aleksandr-kuznetsov.jpg",
} as const;

export default function StudioPage() {
  const founder = studioHeroFounder;

  return (
    <div className="pt-[var(--header-h)]">
      {/* Studio exception: brand + founder + atelier ledger figures in one hero */}
      <header
        data-hero
        className="shell grid gap-10 pb-14 pt-10 md:grid-cols-2 md:items-end md:gap-16 md:pb-20 md:pt-14"
      >
        <div className="flex max-w-xl flex-col">
          <h1
            data-hero-el
            className="font-display m-0 text-[clamp(2.75rem,8vw,5.25rem)] leading-[0.95] tracking-[-0.03em]"
          >
            FISHEYE
          </h1>
          <p
            data-hero-el
            className="mt-4 mb-0 text-[0.75rem] font-medium tracking-[0.12em] text-[var(--color-grey-700)] uppercase"
          >
            Studio · Marbella since 2009
          </p>
          <p
            data-hero-el
            className="measure mt-8 mb-0 max-w-[36ch] text-[1rem] leading-relaxed text-[var(--color-grey-800)] md:text-[1.125rem]"
          >
            {antiOrphan(
              "An interior architecture atelier for villas and luxury apartments — design, author’s supervision, and FF&E.",
            )}
          </p>

          <dl
            data-hero-el
            aria-label="Studio in numbers"
            className="mt-10 mb-0 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-[var(--color-grey-200)] pt-8 md:mt-12 md:gap-y-10"
          >
            {site.stats.map((stat) => (
              <div key={stat.label} className="m-0 min-w-0">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="m-0">
                  <p className="font-display m-0 text-[clamp(2.25rem,5vw,3.5rem)] leading-none tracking-[-0.03em] tabular-nums">
                    {stat.value}
                  </p>
                  <p className="mt-2.5 mb-0 max-w-[14ch] text-[0.75rem] leading-snug text-[var(--color-grey-700)]">
                    {stat.label}
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {founder ? (
          <figure className="m-0">
            <div
              data-hero-plate
              data-img-wrap
              className="media-frame aspect-[4/5] overflow-hidden"
            >
              <Image
                data-img
                src={founder.photo}
                alt={founder.name}
                width={900}
                height={1100}
                priority
                sizes="(max-width: 768px) 100vw, 45vw"
                className="h-[120%] w-full object-cover will-change-transform"
              />
            </div>
            <figcaption className="mt-4 mb-0 flex flex-wrap items-baseline justify-between gap-2 border-t border-[var(--color-grey-200)] pt-3">
              <span className="font-display text-[1.15rem] tracking-[-0.015em]">
                {founder.name}
              </span>
              <span className="text-[0.8rem] text-[var(--color-grey-700)]">
                {founder.role}
              </span>
            </figcaption>
          </figure>
        ) : null}
      </header>

      <TeamProofRow />

      <section className="bg-[var(--color-beige-2)]">
        <div className="shell section-y">
          <h2
            data-reveal
            className="font-display title-measure-sm m-0 mb-12 text-[clamp(1.85rem,3.5vw,2.75rem)] tracking-[-0.02em] md:mb-16"
          >
            {antiOrphan("What we hold to")}
          </h2>
          <ul
            className="m-0 grid list-none gap-10 p-0 md:grid-cols-3 md:gap-12"
            data-reveal-group
          >
            {beliefPillars.map((pillar) => (
              <li key={pillar.title} data-reveal-child className="m-0">
                <h3 className="font-display m-0 text-[clamp(1.35rem,2vw,1.75rem)] tracking-[-0.015em]">
                  {pillar.title}
                </h3>
                <p className="mt-3 mb-0 max-w-[36ch] text-[0.9rem] leading-relaxed text-[var(--color-grey-800)]">
                  {pillar.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section data-cta-band className="theme-dark">
        <div className="shell flex flex-col items-start justify-between gap-8 py-16 md:flex-row md:items-end">
          <div data-cta-el>
            <h2 className="font-display m-0 text-[clamp(1.5rem,2.5vw,2.25rem)] tracking-[-0.02em]">
              {antiOrphan("If you would like to work with us")}
            </h2>
            <p className="mt-3 mb-0 max-w-xl text-[color-mix(in_srgb,var(--color-white)_72%,transparent)]">
              Based in {site.address}. Call {site.phone} or send a project
              request.
            </p>
          </div>
          <Button
            href="/request"
            variant="primary"
            className="shrink-0"
            data-cta-el
          >
            Get in touch
          </Button>
        </div>
      </section>
    </div>
  );
}
