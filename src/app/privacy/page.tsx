import type { Metadata } from "next";
import { site } from "@/content/site";
import { antiOrphan } from "@/lib/typography";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <div className="pt-[var(--header-h)]">
      <div className="shell-narrow section-y">
        <header className="mb-10 border-b border-[var(--color-grey-200)] pb-8">
          <h1
            data-reveal
            className="font-display m-0 text-[clamp(2rem,4vw,3rem)] tracking-[-0.02em]"
          >
            {antiOrphan("Privacy Policy")}
          </h1>
        </header>
        <div
          data-reveal
          className="space-y-5 leading-relaxed text-[var(--color-grey-800)]"
        >
          <p>
            {site.legalName} (“we”) processes contact details you submit through
            this website solely to respond to project enquiries and provide our
            services.
          </p>
          <p>
            Information you send via the request form, email, phone, WhatsApp, or
            Telegram may include your name, contact details, and project
            description. We do not sell personal data.
          </p>
          <p>
            For privacy questions, contact{" "}
            <a href={site.emailHref} className="link-line text-[var(--color-ink)]">
              {site.email}
            </a>{" "}
            or write to {site.address}.
          </p>
          <p>
            This page summarises our practices for the redesigned local site. The
            live production policy on fisheye-interior.com remains authoritative
            until replaced.
          </p>
        </div>
      </div>
    </div>
  );
}
