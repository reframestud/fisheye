"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/Button";
import { site } from "@/content/site";
import { motion, prefersReducedMotion } from "@/lib/motion";

export function SiteHeader() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const isHome = pathname === "/";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const header = headerRef.current;
    const logo = logoRef.current;
    if (!header || !logo) return;

    const reduced = prefersReducedMotion();
    const LOGO_MIN = 0.72;
    const LOGO_RANGE = 900;
    let raf = 0;

    // Scrub logo scale 1:1 with scroll (Lenis updates scrollY each frame).
    // No CSS transition on transform — that lagged behind and felt unsynced.
    const apply = () => {
      raf = 0;
      const y = window.scrollY;
      const solid = y > 40 || !isHome || open;
      header.dataset.solid = solid ? "true" : "false";
      if (reduced) {
        logo.style.transform = "";
        return;
      }
      const t = Math.min(1, Math.max(0, y / LOGO_RANGE));
      const scale = 1 - t * (1 - LOGO_MIN);
      logo.style.transform = `scale(${scale})`;
      logo.style.transformOrigin = "left center";
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isHome, open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Mobile menu enter choreography
  useEffect(() => {
    const panel = mobilePanelRef.current;
    if (!panel || !open) return;
    if (prefersReducedMotion()) return;

    const links = panel.querySelectorAll("[data-mobile-link]");
    const footer = panel.querySelectorAll("[data-mobile-foot]");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        panel,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.28, ease: motion.ease.ui }
      );
      gsap.fromTo(
        links,
        { y: motion.distance.menu, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: motion.duration.menu,
          stagger: motion.stagger.menu,
          ease: motion.ease.out,
          delay: 0.06,
          clearProps: "transform,opacity,visibility",
        }
      );
      gsap.fromTo(
        footer,
        { y: motion.distance.menuFoot, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.5,
          stagger: motion.stagger.menu,
          ease: motion.ease.out,
          delay: 0.22,
          clearProps: "transform,opacity,visibility",
        }
      );
    }, panel);

    return () => ctx.revert();
  }, [open]);

  return (
    <header
      ref={headerRef}
      data-solid={isHome && !open ? "false" : "true"}
      className="group fixed inset-x-0 top-0 z-50 h-[var(--header-h)] transition-[background-color,color,border-color] duration-300 data-[solid=true]:border-b data-[solid=true]:border-[var(--color-grey-200)] data-[solid=true]:bg-[var(--color-beige)] data-[solid=true]:text-[var(--color-ink)] data-[solid=false]:border-transparent data-[solid=false]:bg-transparent data-[solid=false]:text-[var(--color-white)]"
    >
      <div className="shell relative z-[60] flex h-full items-center justify-between gap-6">
        <Link
          ref={logoRef}
          href="/"
          className="flex items-center no-underline will-change-transform"
          aria-label="FISHEYE home"
          data-nav-logo
        >
          <BrandLogo variant="auto" priority />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          {site.nav
            .filter((item) => item.href !== "/request")
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                data-nav-link
                className="nav-link text-[0.875rem]"
              >
                {item.label}
              </Link>
            ))}
          <a
            href={site.phoneHref}
            data-nav-link
            className="nav-link text-[0.75rem] font-medium tracking-[0.04em]"
          >
            {site.phone}
          </a>
          <Button href="/request" variant="primary" size="sm">
            Request
          </Button>
        </nav>

        <button
          type="button"
          className="label cursor-pointer border-0 bg-transparent p-2 text-current transition-opacity duration-200 hover:opacity-70 md:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <div
        ref={mobilePanelRef}
        id={menuId}
        hidden={!open}
        className="fixed inset-0 z-50 flex flex-col bg-[var(--color-beige)] pt-[var(--header-h)] text-[var(--color-ink)] md:hidden"
      >
        <nav
          aria-label="Mobile"
          className="shell flex flex-1 flex-col justify-between py-10"
        >
          <ul className="m-0 flex list-none flex-col gap-6 p-0">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  data-mobile-link
                  className="font-display text-[clamp(2rem,8vw,2.75rem)] tracking-[-0.02em] no-underline transition-opacity duration-200 hover:opacity-70"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-4 border-t border-[var(--color-grey-200)] pt-8">
            <a
              href={site.phoneHref}
              data-mobile-foot
              className="link-line text-[1rem] no-underline"
            >
              {site.phone}
            </a>
            <Button
              href="/request"
              variant="primary"
              className="w-fit"
              data-mobile-foot
              onClick={() => setOpen(false)}
            >
              Request
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
