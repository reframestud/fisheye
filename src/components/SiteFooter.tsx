import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer
      data-footer
      className="mt-0 border-t border-[var(--color-grey-200)] bg-[var(--color-beige-2)]"
    >
      <div
        className="shell grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]"
        data-reveal-group
      >
        <div data-reveal-child>
          <Link href="/" className="inline-flex no-underline" aria-label="FISHEYE home">
            <BrandLogo size="footer" />
          </Link>
          <p className="mt-6 max-w-sm text-[0.875rem] leading-relaxed text-[var(--color-grey-800)]">
            {site.address}
            <br />
            <a href={site.phoneHref} className="link-line text-[var(--color-ink)]">
              {site.phone}
            </a>
            <br />
            <a href={site.emailHref} className="link-line text-[var(--color-ink)]">
              {site.email}
            </a>
          </p>
        </div>

        <div data-reveal-child>
          <p className="label m-0 mb-5">Studio</p>
          <ul className="m-0 flex list-none flex-col gap-2.5 p-0 text-[0.875rem]">
            <li>
              <Link href="/studio" className="link-line no-underline">
                Studio
              </Link>
            </li>
            <li>
              <Link href="/projects" className="link-line no-underline">
                Projects
              </Link>
            </li>
            <li>
              <Link href="/workscheme" className="link-line no-underline">
                Work scheme
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="link-line no-underline">
                Privacy
              </Link>
            </li>
          </ul>
        </div>

        <div data-reveal-child>
          <p className="label m-0 mb-5">Connect</p>
          <ul className="m-0 flex list-none flex-col gap-2.5 p-0 text-[0.875rem]">
            <li>
              <Link href="/request" className="link-line no-underline">
                Request a project
              </Link>
            </li>
            <li>
              <Link href="/contact" className="link-line no-underline">
                Contact
              </Link>
            </li>
            <li>
              <a
                href={site.instagram}
                target="_blank"
                rel="noreferrer"
                className="link-line no-underline"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href={site.behance}
                target="_blank"
                rel="noreferrer"
                className="link-line no-underline"
              >
                Behance
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="shell border-t border-[var(--color-grey-200)] py-5" data-reveal>
        <p className="label m-0 normal-case tracking-normal text-[var(--color-grey-700)]">
          © {new Date().getFullYear()} {site.legalName}
        </p>
      </div>
    </footer>
  );
}
