import type { Metadata } from "next";
import projects from "@/content/projects.json";
import { ProjectsIndex } from "@/components/ProjectsIndex";
import {
  filterProjectGallery,
  resolveProjectCover,
} from "@/lib/project-media";
import { antiOrphan } from "@/lib/typography";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Interior design projects by FISHEYE for villas and luxury apartments in Marbella and beyond.",
};

export default function ProjectsPage() {
  const list = projects.map((project) => ({
    slug: project.slug,
    title: project.title,
    location: project.location,
    summary: project.summary,
    cover: resolveProjectCover(
      project.cover,
      filterProjectGallery(project.gallery)
    ),
  }));

  return (
    <div className="pt-[var(--header-h)]">
      <header className="shell section-y pb-10 md:pb-14">
        <h1
          data-reveal
          className="font-display title-measure-sm m-0 text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.02] tracking-[-0.03em]"
        >
          {antiOrphan("Interior projects")}
        </h1>
        <p
          data-reveal
          className="measure mt-6 mb-0 text-[1rem] text-[var(--color-grey-800)] md:text-[1.125rem]"
        >
          {list.length} commissions: villas, apartments, and interiors across
          Marbella and beyond.
        </p>
      </header>

      <ProjectsIndex projects={list} />
    </div>
  );
}
