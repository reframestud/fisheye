import { testimonials } from "@/content/site";

/**
 * Homepage Feedback — guest-book ledger of named client reviews.
 * Attribution leads; spoken quote follows with a large opening mark.
 * Hairline rules only — not an editorial pull-quote stack or card grid.
 *
 * Direction: guestbook-ledger (board THE ROLL; assumed after unanswered wait).
 */
export function FeedbackSection() {
  return (
    <section className="section-y" aria-labelledby="feedback-heading">
      <div className="shell">
        <h2
          id="feedback-heading"
          data-reveal
          className="font-display m-0 mb-12 text-[clamp(1.85rem,3.5vw,2.75rem)] tracking-[-0.02em] md:mb-16"
        >
          Feedback
        </h2>

        <div
          className="grid gap-x-14 gap-y-2 md:grid-cols-2"
          data-reveal-group
        >
          {testimonials.map((t) => (
            <blockquote
              key={`${t.name}-${t.place}`}
              data-reveal-child
              className="m-0 border-t border-[var(--color-grey-200)] py-8 md:py-9"
            >
              <header className="mb-4">
                <cite className="font-display not-italic m-0 block text-[1.15rem] leading-tight tracking-[-0.015em]">
                  {t.name}
                </cite>
                <p className="mt-1.5 mb-0 text-[0.75rem] font-medium tracking-[0.08em] text-[var(--color-grey-700)] uppercase">
                  {t.place}
                </p>
              </header>

              <p className="relative m-0 max-w-[42ch] pl-5 text-[0.875rem] leading-relaxed text-[var(--color-grey-800)] md:pl-6 md:text-[1rem]">
                <span
                  aria-hidden="true"
                  className="font-display pointer-events-none absolute top-[-0.1em] left-0 select-none text-[2.75rem] leading-none text-[var(--color-ink)]/35"
                >
                  “
                </span>
                <span className="relative">{t.quote}</span>
              </p>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
