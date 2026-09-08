import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/Button";
import { FeedbackSection } from "@/components/FeedbackSection";
import { OfferDossierScroll } from "@/components/OfferDossierScroll";
import projects from "@/content/projects.json";
import {
  homeCopy,
  homeSelectedSlugs,
} from "@/content/site";
import {
  filterProjectGallery,
  resolveProjectCover,
} from "@/lib/project-media";
import { antiOrphan } from "@/lib/typography";

export default function HomePage() {
  const withCovers = projects.map((project) => ({
    ...project,
    cover: resolveProjectCover(
      project.cover,
      filterProjectGallery(project.gallery)
    ),
  }));
  const bySlug = Object.fromEntries(
    withCovers.map((project) => [project.slug, project])
  );
  const hero = withCovers[0];

  const selectedWork = homeSelectedSlugs
    .map((slug) => bySlug[slug])
    .filter((project): project is NonNullable<typeof project> => project != null);

  return (
    <>
      <section
        data-hero
        className="relative flex min-h-[100svh] items-end overflow-hidden bg-[var(--color-ink)] text-[var(--color-white)]"
      >
        <div
          data-hero-plate
          data-img-wrap
          className="absolute inset-0 overflow-hidden"
        >
          {hero && (
            <Image
              data-img
              src={hero.cover}
              alt={hero.title}
              fill
              priority
              className="object-cover scale-[1.12] will-change-transform"
              sizes="100vw"
            />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.72)_0%,rgba(0,0,0,0.25)_45%,rgba(0,0,0,0.15)_100%)]" />
        </div>

        <div className="shell relative z-10 w-full pb-16 pt-[calc(var(--header-h)+3rem)] md:pb-24">
          <h1
            data-hero-el
            className="font-display title-measure-lg m-0 text-[clamp(1.75rem,4.2vw,3.25rem)] leading-[1.08] tracking-[-0.02em]"
          >
            {antiOrphan(homeCopy.offer)}
          </h1>
          <p
            data-hero-el
            className="measure mt-5 mb-8 max-w-[42ch] text-[1rem] leading-relaxed text-[color-mix(in_srgb,var(--color-white)_78%,transparent)] md:text-[1.125rem]"
          >
            {homeCopy.support}
          </p>
          <div data-hero-el className="flex flex-wrap items-center gap-4">
            <Button href="/request" variant="primary">
              {homeCopy.cta}
            </Button>
            <Button href="/projects" variant="secondary">
              View projects
            </Button>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="shell grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-end md:gap-16">
          <h2
            data-reveal="lift-lg"
            className="font-display m-0 text-[clamp(2rem,4vw,3.25rem)] leading-[1.1] tracking-[-0.02em]"
          >
            {antiOrphan("An experiential approach to interiors")}
          </h2>
          <p
            data-reveal
            className="measure m-0 text-[1rem] leading-relaxed text-[var(--color-grey-800)] md:text-[1.125rem]"
          >
            Based in Nueva Andalucía, FISHEYE designs and delivers villas and
            luxury apartments end to end: concept, working drawings, on-site
            author’s supervision, and FF&E, so the property looks better and
            sells faster.
          </p>
        </div>
      </section>

      {selectedWork.length > 0 && (
        <section className="section-y">
          <div className="shell mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
            <div data-reveal>
              <h2 className="font-display m-0 text-[clamp(1.85rem,3.5vw,2.75rem)] tracking-[-0.02em]">
                {antiOrphan("Selected work")}
              </h2>
              <p className="measure mt-4 mb-0 max-w-[42ch] text-[0.875rem] leading-relaxed text-[var(--color-grey-800)] md:text-[1rem]">
                Case studies from recent interiors: space, material, and light
                in detail.
              </p>
            </div>
            <Button
              href="/projects"
              variant="secondary"
              size="sm"
              className="shrink-0 self-start md:self-auto"
              data-reveal
            >
              All projects
            </Button>
          </div>
          <div className="shell grid gap-12 md:grid-cols-12 md:gap-8">
            {selectedWork.map((project, index) => {
              const layout =
                index === 0
                  ? "md:col-span-12"
                  : index === 1
                    ? "md:col-span-7"
                    : "md:col-span-5 md:mt-24";
              return (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  data-reveal={index === 0 ? "clip" : "lift"}
                  className={`group block no-underline ${layout}`}
                >
                  <div
                    data-img-wrap
                    className={`media-frame relative overflow-hidden ${index === 0 ? "aspect-[21/9]" : index === 1 ? "aspect-[16/10]" : "aspect-[4/5]"}`}
                  >
                    <Image
                      data-img
                      src={project.cover}
                      alt={project.title}
                      fill
                      sizes={
                        index === 0
                          ? "100vw"
                          : "(max-width: 768px) 100vw, 50vw"
                      }
                      className="object-cover will-change-transform"
                    />
                  </div>
                  <h3 className="font-display mt-5 mb-2 text-[clamp(1.25rem,2vw,1.65rem)] tracking-[-0.015em]">
                    {antiOrphan(project.title)}
                  </h3>
                  <p className="m-0 max-w-[52ch] text-[0.875rem] leading-relaxed text-[var(--color-grey-800)]">
                    {project.summary}
                  </p>
                  <p className="mt-2 mb-0 text-[0.8rem] text-[var(--color-grey-700)]">
                    {project.location}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <OfferDossierScroll />

      <FeedbackSection />

      <section data-cta-band className="theme-dark">
        <div className="shell flex flex-col items-start justify-between gap-8 py-20 md:flex-row md:items-end md:py-24">
          <div data-cta-el>
            <h2 className="font-display m-0 text-[clamp(2rem,4vw,3.25rem)] tracking-[-0.02em]">
              {antiOrphan("Ready to begin?")}
            </h2>
            <p className="measure mt-4 mb-0 text-[color-mix(in_srgb,var(--color-white)_72%,transparent)]">
              Tell us about the property. We will send a proposal with timeline
              and work scheme.
            </p>
          </div>
          <Button
            href="/request"
            variant="primary"
            data-cta-el
            className="shrink-0"
          >
            Project request
          </Button>
        </div>
      </section>
    </>
  );
}
