import Image from "next/image";
import { HorizontalTrack } from "@/components/HorizontalTrack";
import { team } from "@/content/site";
import { antiOrphan } from "@/lib/typography";

type TeamProofRowProps = {
  /** Optional section heading. Defaults to a quiet atelier label. */
  heading?: string;
};

/**
 * Horizontal named-people proof — Parchment Atelier signature.
 * Scrubbed 3/4 plates + hairline caption (name, role). Not a card grid.
 */
export function TeamProofRow({
  heading = "People who make the project for you",
}: TeamProofRowProps) {
  return (
    <section
      className="border-t border-[var(--color-grey-200)] pt-14 pb-16 md:pt-16 md:pb-20"
      aria-labelledby="team-proof-heading"
    >
      <div className="shell">
        <h2
          id="team-proof-heading"
          data-reveal
          className="font-display title-measure-sm m-0 mb-10 text-[clamp(1.85rem,3.5vw,2.75rem)] tracking-[-0.02em] md:mb-12"
        >
          {antiOrphan(heading)}
        </h2>
      </div>

      <HorizontalTrack
        className="team-proof-track team-proof-track--shell flex snap-x snap-proximity gap-4 overflow-x-auto overscroll-x-contain pb-2 md:gap-5"
        data-reveal-group
        role="list"
        aria-labelledby="team-proof-heading"
      >
        {team.map((person, index) => (
          <figure
            key={`${person.name}-${person.photo}`}
            role="listitem"
            data-reveal-child
            className="m-0 w-[min(72vw,16.5rem)] shrink-0 snap-start md:w-[15.5rem]"
          >
            <div
              data-img-wrap
              className="media-frame aspect-[3/4] overflow-hidden"
            >
              <Image
                data-img
                src={person.photo}
                alt={person.name}
                width={480}
                height={640}
                sizes="(max-width: 768px) 72vw, 248px"
                priority={index < 3}
                className="h-[120%] w-full object-cover will-change-transform"
              />
            </div>
            <figcaption className="mt-3 mb-0 border-t border-[var(--color-grey-200)] pt-3">
              <p className="font-display m-0 text-[1.15rem] leading-tight tracking-[-0.015em]">
                {person.name}
              </p>
              <p className="mt-1.5 mb-0 text-[0.75rem] font-medium tracking-[0.08em] text-[var(--color-grey-700)] uppercase">
                {person.role}
              </p>
            </figcaption>
          </figure>
        ))}
      </HorizontalTrack>
    </section>
  );
}
