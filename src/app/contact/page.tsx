import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/Button";
import projects from "@/content/projects.json";
import { site } from "@/content/site";
import {
  filterProjectGallery,
  resolveProjectCover,
} from "@/lib/project-media";
import { antiOrphan } from "@/lib/typography";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact FISHEYE Architecture & Design in Nueva Andalucía, Marbella.",
};

export default function ContactPage() {
  // Same “latest” rule as the homepage hero: first entry in projects.json.
  const latest = projects[0];
  const contactPlate = latest
    ? resolveProjectCover(
        latest.cover,
        filterProjectGallery(latest.gallery)
      )
    : "/images/home/home-02.jpg";
  const plateAlt = latest
    ? `${latest.title}${latest.location ? ` — ${latest.location}` : ""}`
    : "FISHEYE studio interior";

  return (
    <div className="pt-[var(--header-h)]">
      <header className="shell section-y pb-10 md:pb-12">
        <h1
          data-reveal
          className="font-display m-0 text-[clamp(2.5rem,6vw,4.25rem)] tracking-[-0.03em]"
        >
          {antiOrphan("Contact us")}
        </h1>
        <p
          data-reveal
          className="mt-5 mb-0 max-w-md text-[1rem] text-[var(--color-grey-800)] md:text-[1.125rem]"
        >
          Whenever you need a project, call us — we will help.
        </p>
      </header>

      <div className="shell grid items-start gap-10 pb-[clamp(4rem,10vw,8rem)] lg:grid-cols-2 lg:gap-14">
        {/* Left: plate + address overlay (bottom-left, 24px) */}
        <div
          data-reveal
          data-img-wrap
          className="media-frame relative aspect-[4/5] w-full overflow-hidden md:aspect-[3/4] lg:max-w-none"
        >
          <Image
            data-img
            src={contactPlate}
            alt={plateAlt}
            fill
            className="object-cover will-change-transform"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent"
          />
          <div className="absolute bottom-6 left-6 z-[1] max-w-[16rem] text-left text-[var(--color-white)]">
            <p className="font-display m-0 text-[1.15rem] tracking-[-0.015em]">
              {site.legalName}
            </p>
            <p className="mt-2 mb-0 text-[0.8rem] leading-snug text-[color-mix(in_srgb,var(--color-white)_88%,transparent)]">
              {site.address}
            </p>
            <p className="mt-3 mb-0 text-[0.8rem] leading-snug">
              <a
                href={site.phoneHref}
                className="text-[var(--color-white)] no-underline hover:underline"
              >
                {site.phone}
              </a>
              <br />
              <a
                href={site.emailHref}
                className="text-[var(--color-white)] no-underline hover:underline"
              >
                {site.email}
              </a>
            </p>
            <p className="mt-3 mb-0 text-[0.7rem] tracking-[0.04em] text-[color-mix(in_srgb,var(--color-white)_72%,transparent)]">
              {site.hours}
            </p>
          </div>
        </div>

        {/* Right: contact form */}
        <form
          data-reveal
          className="grid gap-5 lg:pt-1"
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
            <span className="label">Message</span>
            <textarea name="message" required rows={6} className="field-area" />
          </label>
          <p className="m-0 text-[0.8rem] text-[var(--color-grey-700)]">
            By submitting, you agree to our{" "}
            <Link href="/privacy" className="link-line">
              Privacy Policy
            </Link>
            .
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" variant="primary" className="w-fit">
              Send message
            </Button>
            <Button
              href={site.whatsapp}
              variant="ghost"
              target="_blank"
              rel="noreferrer"
              className="w-fit"
            >
              WhatsApp
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
