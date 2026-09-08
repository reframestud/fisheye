import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/Button";
import { site } from "@/content/site";
import { antiOrphan } from "@/lib/typography";

export const metadata: Metadata = {
  title: "Request a project",
  description:
    "Request a FISHEYE project: proposal with timeline and work scheme.",
};

export default function RequestPage() {
  return (
    <div className="pt-[var(--header-h)]">
      <header className="shell section-y pb-10 md:pb-12">
        <h1
          data-reveal
          className="font-display title-measure-sm m-0 text-[clamp(2.25rem,5vw,3.85rem)] tracking-[-0.03em]"
        >
          {antiOrphan("Request a project")}
        </h1>
        <p
          data-reveal
          className="mt-6 mb-0 max-w-xl text-[1rem] text-[var(--color-grey-800)] md:text-[1.125rem]"
        >
          Tell us about the property and what you need. We will send a proposal
          with timeline, prices, and work scheme.
        </p>
      </header>

      <form
        data-reveal
        className="shell grid max-w-2xl gap-6 pb-12"
        action={`mailto:${site.email}`}
        method="post"
        encType="text/plain"
      >
        <label className="grid gap-2">
          <span className="label">Name</span>
          <input name="name" required className="field" />
        </label>
        <label className="grid gap-2">
          <span className="label">Email</span>
          <input type="email" name="email" required className="field" />
        </label>
        <label className="grid gap-2">
          <span className="label">Phone</span>
          <input type="tel" name="phone" className="field" />
        </label>
        <label className="grid gap-2">
          <span className="label">Property / location</span>
          <input
            name="property"
            placeholder="Villa / apartment · Marbella"
            className="field"
          />
        </label>
        <label className="grid gap-2">
          <span className="label">Project details</span>
          <textarea name="details" required rows={6} className="field-area" />
        </label>
        <p className="m-0 text-[0.8rem] text-[var(--color-grey-700)]">
          By submitting, you agree to our{" "}
          <Link href="/privacy" className="link-line">
            Privacy Policy
          </Link>
          .
        </p>
        <Button type="submit" variant="primary" className="w-fit">
          Send request
        </Button>
      </form>

      <p
        data-reveal
        className="shell mb-0 border-t border-[var(--color-grey-200)] py-10 text-[var(--color-grey-700)]"
      >
        Prefer a direct line?{" "}
        <a href={site.phoneHref} className="link-line text-[var(--color-ink)]">
          {site.phone}
        </a>{" "}
        ·{" "}
        <a
          href={site.whatsapp}
          target="_blank"
          rel="noreferrer"
          className="link-line text-[var(--color-ink)]"
        >
          WhatsApp
        </a>
      </p>
    </div>
  );
}
