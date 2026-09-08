import Image from "next/image";
import { offerCards, pillars } from "@/content/site";
import { antiOrphan } from "@/lib/typography";

/**
 * Homepage offer band — Atelier dossier cards (structure-2).
 * Tall Design / Supervision / FF&E plates stay; six commitments ride a
 * smaller horizontal proof strip underneath (board: horizontal-strip).
 */
export function OfferDossierScroll() {
  return (
    <section
      className="bg-[var(--color-beige-2)] section-y"
      aria-labelledby="pillars-heading"
      data-pillars-band
    >
      <div className="shell">
        <h2
          id="pillars-heading"
          data-reveal="lift-lg"
          className="font-display title-measure m-0 mb-10 text-[clamp(1.85rem,3.5vw,2.75rem)] tracking-[-0.02em] md:mb-12"
        >
          {antiOrphan("Design, supervision, and FF&E")}
        </h2>
      </div>

      <div
        className="offer-dossier-track offer-dossier-track--shell"
        data-reveal-group
        role="list"
        aria-label="Design, Supervision, and FF&E"
      >
        {offerCards.map((card, index) => (
          <article
            key={card.title}
            role="listitem"
            data-reveal-child
            className="offer-dossier-card m-0"
          >
            <div
              data-img-wrap
              className="media-frame aspect-[3/4] overflow-hidden"
            >
              <Image
                data-img
                src={card.image}
                alt={card.alt}
                width={560}
                height={747}
                sizes="(max-width: 767px) 78vw, (max-width: 1200px) 30vw, 380px"
                priority={index === 0}
                className="h-[120%] w-full object-cover will-change-transform"
              />
            </div>
            <h3 className="font-display mt-4 mb-0 text-[clamp(1.2rem,1.6vw,1.45rem)] tracking-[-0.015em]">
              {antiOrphan(card.title)}
            </h3>
            <p className="measure mt-3 mb-0 max-w-[36ch] text-[0.875rem] leading-relaxed text-[var(--color-grey-800)] md:text-[1rem]">
              {card.body}
            </p>
          </article>
        ))}
      </div>

      <div
        className="offer-proof-strip offer-proof-strip--shell mt-12 md:mt-16"
        data-reveal-group
        role="list"
        aria-label="How we deliver"
      >
        {pillars.map((proof) => (
          <article
            key={proof.title}
            role="listitem"
            data-reveal-child
            className="offer-proof-tile m-0"
          >
            <h3 className="font-display m-0 text-[clamp(1.15rem,1.5vw,1.35rem)] tracking-[-0.015em]">
              {antiOrphan(proof.title)}
            </h3>
            <p className="mt-3 mb-0 text-[0.8rem] leading-relaxed text-[var(--color-grey-800)] md:text-[0.875rem]">
              {proof.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
