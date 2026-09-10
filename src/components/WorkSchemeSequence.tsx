import Image from "next/image";
import { HorizontalTrack } from "@/components/HorizontalTrack";
import { antiOrphan } from "@/lib/typography";
import { cn } from "@/lib/cn";

export type WorkStepPlate = {
  src: string;
  alt: string;
};

export type WorkStepGalleryItem = WorkStepPlate & {
  caption?: string;
};

export type WorkStep = {
  title: string;
  body: string;
  plate: WorkStepPlate;
  gallery?: readonly WorkStepGalleryItem[];
};

type WorkSchemeSequenceProps = {
  steps: readonly WorkStep[];
};

/**
 * Horizontal proof chapters — process as scrubbed plates with Fig. numerals.
 * Deep-linkable stage ids; Lenis/GSAP scrub via data-img-wrap / data-img.
 */
export function WorkSchemeSequence({ steps }: WorkSchemeSequenceProps) {
  return (
    <ol
      className="m-0 list-none p-0 pb-[clamp(3rem,8vw,6rem)]"
      aria-label="Project stages"
    >
      {steps.map((step, index) => {
        const n = String(index + 1).padStart(2, "0");
        const lead = index === 0;
        const reverse = index % 2 === 1;
        const gallery = step.gallery;

        return (
          <li
            key={step.title}
            id={`work-step-${index + 1}`}
            data-reveal={lead ? undefined : "true"}
            className={cn(
              "border-t border-[var(--color-grey-200)]",
              lead ? "pt-8 pb-14 md:pt-10 md:pb-20" : "py-14 md:py-20",
            )}
          >
            <div
              className={cn(
                "shell grid items-start gap-8 md:gap-12 lg:gap-16",
                "md:grid-cols-12",
              )}
            >
              <div
                className={cn(
                  "md:col-span-6",
                  reverse ? "md:order-2" : "md:order-1",
                )}
              >
                <div
                  data-img-wrap
                  data-hero-plate={lead ? true : undefined}
                  className={cn(
                    "media-frame overflow-hidden",
                    lead ? "aspect-[4/5] md:aspect-[5/6]" : "aspect-[4/5] md:aspect-[16/11]",
                  )}
                >
                  <Image
                    data-img
                    data-hero-el={lead ? true : undefined}
                    src={step.plate.src}
                    alt={step.plate.alt}
                    width={1200}
                    height={1500}
                    priority={index < 2}
                    loading={index < 2 ? undefined : "eager"}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="h-[120%] w-full object-cover will-change-transform"
                  />
                </div>
              </div>

              <div
                className={cn(
                  "flex flex-col md:col-span-6 md:pt-2",
                  reverse ? "md:order-1" : "md:order-2",
                  lead ? "md:justify-end md:pb-4" : "md:justify-center",
                )}
              >
                <p
                  aria-hidden
                  className={cn(
                    "font-display m-0 tabular-nums tracking-[-0.04em] text-[var(--color-ink)]",
                    lead
                      ? "text-[clamp(4.5rem,12vw,8rem)] leading-none"
                      : "text-[clamp(3rem,7vw,5.5rem)] leading-none",
                  )}
                >
                  {n}
                </p>
                <h2
                  className={cn(
                    "font-display m-0 mt-5 tracking-[-0.02em]",
                    lead
                      ? "text-[clamp(1.75rem,3.2vw,2.75rem)]"
                      : "text-[clamp(1.5rem,2.6vw,2.25rem)]",
                  )}
                >
                  <span className="sr-only">Figure {n}. </span>
                  {antiOrphan(step.title)}
                </h2>
                <p
                  className={cn(
                    "measure mb-0 text-[var(--color-grey-800)]",
                    lead
                      ? "mt-5 max-w-[40ch] text-[1rem] leading-relaxed md:text-[1.125rem]"
                      : "mt-4 max-w-[42ch] text-[0.875rem] leading-relaxed md:text-[1rem]",
                  )}
                >
                  {step.body}
                </p>
              </div>
            </div>

            {gallery && gallery.length > 0 ? (
              <div
                className="mt-10 md:mt-14"
                data-reveal-group
                aria-label={`${step.title} proof plates`}
              >
                <HorizontalTrack className="team-proof-track flex snap-x snap-proximity gap-4 overflow-x-auto overscroll-x-contain px-[var(--site-margin)] pb-2 md:gap-5">
                  {gallery.map((item, gIndex) => (
                    <figure
                      key={`${item.src}-${gIndex}`}
                      data-reveal-child
                      className="m-0 w-[min(70vw,18rem)] shrink-0 snap-start md:w-[17rem]"
                    >
                      <div
                        data-img-wrap
                        className="media-frame aspect-[4/5] overflow-hidden md:aspect-[3/4]"
                      >
                        <Image
                          data-img
                          src={item.src}
                          alt={item.alt}
                          width={640}
                          height={800}
                          sizes="(max-width: 768px) 70vw, 272px"
                          className="h-[120%] w-full object-cover will-change-transform"
                        />
                      </div>
                      {item.caption ? (
                        <figcaption className="mt-3 mb-0 border-t border-[var(--color-grey-200)] pt-3 text-[0.75rem] font-medium tracking-[0.08em] text-[var(--color-grey-700)] uppercase">
                          {item.caption}
                        </figcaption>
                      ) : null}
                    </figure>
                  ))}
                </HorizontalTrack>
              </div>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
