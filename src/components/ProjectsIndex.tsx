"use client";

import Image from "next/image";
import Link from "next/link";
import { antiOrphan } from "@/lib/typography";

export type ProjectsIndexItem = {
  slug: string;
  title: string;
  location: string;
  summary: string;
  cover: string;
};

type ProjectsIndexProps = {
  projects: ProjectsIndexItem[];
};

export function ProjectsIndex({ projects }: ProjectsIndexProps) {
  return (
    <div className="shell grid gap-x-8 gap-y-14 pb-[clamp(4rem,10vw,8rem)] md:grid-cols-2 md:gap-y-20">
      {projects.map((project, index) => {
        const wide = index % 5 === 0;
        return (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            data-reveal={wide ? "clip" : "lift"}
            className={`group block no-underline ${wide ? "md:col-span-2" : ""}`}
          >
            <div
              data-img-wrap
              className={`media-frame overflow-hidden ${wide ? "aspect-[21/10]" : "aspect-[4/5]"}`}
            >
              <Image
                data-img
                src={project.cover}
                alt={project.title}
                fill
                sizes={
                  wide
                    ? "(max-width: 768px) 100vw, min(1200px, 100vw)"
                    : "(max-width: 768px) 100vw, 50vw"
                }
                className="object-cover will-change-transform"
              />
            </div>
            <div className="mt-5 flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="font-display m-0 text-[clamp(1.35rem,2vw,1.85rem)] tracking-[-0.015em]">
                {antiOrphan(project.title)}
              </h2>
              <span className="text-[0.8rem] text-[var(--color-grey-700)]">
                {project.location}
              </span>
            </div>
            <p className="mt-2 mb-0 max-w-[48ch] text-[0.875rem] text-[var(--color-grey-700)]">
              {project.summary}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
