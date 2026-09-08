import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { WorkSchemeSequence } from "@/components/WorkSchemeSequence";
import { site, workSteps } from "@/content/site";
import { antiOrphan } from "@/lib/typography";

export const metadata: Metadata = {
  title: "Work scheme",
  description:
    "How a FISHEYE interior project unfolds: from first contact to housewarming, with scheduled stages you can follow.",
};

export default function WorkSchemePage() {
  return (
    <div className="pt-[var(--header-h)]">
      <header className="shell pb-2 pt-10 md:pb-4 md:pt-14">
        <h1
          data-hero
          data-hero-el
          className="font-display title-measure m-0 text-[clamp(2.35rem,5.5vw,4.25rem)] leading-[1.02] tracking-[-0.03em]"
        >
          {antiOrphan("How a FISHEYE project unfolds")}
        </h1>
        <p
          data-hero-el
          className="measure mt-6 mb-0 max-w-[40ch] text-[1rem] text-[var(--color-grey-800)] md:text-[1.125rem]"
        >
          From your first request to the housewarming — every stage is
          scheduled, visible, and accountable.
        </p>
      </header>

      <WorkSchemeSequence steps={workSteps} />

      <section data-cta-band className="theme-dark">
        <div className="shell flex flex-col items-start justify-between gap-8 py-16 md:flex-row md:items-end">
          <div data-cta-el>
            <h2 className="font-display title-measure m-0 text-[clamp(1.5rem,2.5vw,2.25rem)] tracking-[-0.02em]">
              {antiOrphan("Ready for a proposal with timeline and pricing?")}
            </h2>
            <p className="mt-3 mb-0 max-w-xl text-[color-mix(in_srgb,var(--color-white)_72%,transparent)]">
              Tell us about the property. We reply with a commercial offer,
              schedule, and the work scheme for your project. Or call{" "}
              {site.phone}.
            </p>
          </div>
          <Button
            href="/request"
            variant="primary"
            className="shrink-0"
            data-cta-el
          >
            Request a project
          </Button>
        </div>
      </section>
    </div>
  );
}
