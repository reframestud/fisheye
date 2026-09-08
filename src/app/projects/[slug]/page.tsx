import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/Button";
import projects from "@/content/projects.json";
import {
  filterProjectGallery,
  resolveProjectCover,
} from "@/lib/project-media";
import { antiOrphan } from "@/lib/typography";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: "Project" };
  return {
    title: project.title,
    description: project.description || project.summary,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const projectIndex = projects.findIndex((p) => p.slug === slug);
  const project = projectIndex >= 0 ? projects[projectIndex] : undefined;
  if (!project) notFound();

  const gallery = filterProjectGallery(project.gallery);
  const cover = resolveProjectCover(project.cover, gallery);
  const plates = gallery.filter((src) => src !== cover);
  const related = projects
    .filter((p) => p.slug !== slug)
    .slice(0, 2)
    .map((item) => ({
      ...item,
      cover: resolveProjectCover(
        item.cover,
        filterProjectGallery(item.gallery)
      ),
    }));

  return (
    <article>
      <div
        data-img-wrap
        data-reveal="clip"
        className="relative h-[min(78svh,48rem)] w-full overflow-hidden bg-[var(--color-beige-2)]"
      >
        <Image
          data-img
          src={cover}
          alt={project.title}
          fill
          priority
          className="object-cover scale-[1.12] will-change-transform"
          sizes="100vw"
        />
      </div>

      <div className="shell py-12 md:py-16">
        <p data-reveal className="m-0 text-[0.8rem] text-[var(--color-grey-700)]">
          {project.location}
        </p>
        <h1
          data-reveal
          className="font-display title-measure-sm m-0 mt-4 text-[clamp(2.25rem,5vw,4rem)] tracking-[-0.03em]"
        >
          {antiOrphan(project.title)}
        </h1>
        <p
          data-reveal
          className="measure mt-6 mb-0 text-[1rem] leading-relaxed text-[var(--color-grey-800)] md:text-[1.125rem]"
        >
          {project.description || project.summary}
        </p>
      </div>

      {plates.length > 0 && (
        <div className="shell grid gap-6 pb-[clamp(4rem,10vw,8rem)] md:grid-cols-2 md:gap-8">
          {plates.map((src, i) => {
            const wide = i % 3 === 0;
            return (
              <div
                key={src}
                data-reveal
                data-img-wrap
                className={`media-frame overflow-hidden ${wide ? "aspect-[21/10] md:col-span-2" : "aspect-[4/5]"}`}
              >
                <Image
                  data-img
                  src={src}
                  alt={`${project.title}, view ${i + 2}`}
                  fill
                  sizes={
                    wide
                      ? "(max-width: 768px) 100vw, min(1200px, 100vw)"
                      : "(max-width: 768px) 100vw, 50vw"
                  }
                  className="object-cover will-change-transform"
                />
              </div>
            );
          })}
        </div>
      )}

      {related.length > 0 && (
        <section className="border-t border-[var(--color-grey-200)] bg-[var(--color-beige-2)]">
          <div className="shell py-16 md:py-20">
            <div className="mb-10 flex items-end justify-between gap-6">
              <h2
                data-reveal
                className="font-display m-0 text-[clamp(1.5rem,2.5vw,2.25rem)] tracking-[-0.02em]"
              >
                {antiOrphan("Continue exploring")}
              </h2>
              <Button
                href="/projects"
                variant="ghost"
                size="sm"
                className="shrink-0"
              >
                All projects
              </Button>
            </div>
            <div className="grid gap-10 md:grid-cols-2">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/projects/${item.slug}`}
                  data-reveal
                  className="group block no-underline"
                >
                  <div
                    data-img-wrap
                    className="media-frame aspect-[16/10] overflow-hidden"
                  >
                    <Image
                      data-img
                      src={item.cover}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover will-change-transform"
                    />
                  </div>
                  <h3 className="font-display mt-5 mb-1 text-xl tracking-[-0.015em]">
                    {antiOrphan(item.title)}
                  </h3>
                  <p className="m-0 text-[0.8rem] text-[var(--color-grey-700)]">
                    {item.location}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section data-cta-band className="theme-dark">
        <div className="shell flex flex-col items-start justify-between gap-8 py-16 md:flex-row md:items-end">
          <div data-cta-el>
            <h2 className="font-display m-0 text-[clamp(1.5rem,2.5vw,2.25rem)] tracking-[-0.02em]">
              {antiOrphan("Start a project like this")}
            </h2>
            <p className="mt-3 mb-0 max-w-md text-[color-mix(in_srgb,var(--color-white)_72%,transparent)]">
              Tell us about your property. We will send a proposal with timeline
              and work scheme.
            </p>
          </div>
          <Button
            href="/request"
            variant="primary"
            className="shrink-0"
            data-cta-el
          >
            Project request
          </Button>
        </div>
      </section>
    </article>
  );
}
