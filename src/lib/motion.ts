/**
 * FISHEYE motion tokens — Atelier Reveal (amplified intensity).
 * Keep in sync with DESIGN.md motion grammar and CSS custom properties.
 */

export const motion = {
  ease: {
    out: "power3.out",
    settle: "power2.out",
    ui: "power2.out",
  },
  duration: {
    feedback: 0.15,
    ui: 0.22,
    /** First-load #main enter only — soft nav skips this (no post-paint dim). */
    page: 0.28,
    reveal: 1.0,
    revealLg: 1.15,
    hero: 1.15,
    heroPlate: 1.6,
    /** Soft-nav plate-only settle (hero copy stays fully opaque). */
    heroPlateNav: 0.4,
    menu: 0.65,
  },
  stagger: {
    tight: 0.1,
    base: 0.14,
    hero: 0.16,
    menu: 0.1,
  },
  distance: {
    reveal: 40,
    revealLg: 48,
    hero: 40,
    page: 14,
    cta: 44,
    chrome: 24,
    menu: 28,
    menuFoot: 20,
  },
  /** First-load page enter starts nearly opaque — readable on first paint. */
  pageOpacityFrom: 0.9,
  /** Reveal starts near-invisible; CSS default stays opaque if JS never runs. */
  opacityFrom: 0,
  clipFrom: "inset(32% 0 36% 0)",
  clipTo: "inset(0% 0 0% 0)",
  heroPlateScale: 1.1,
  /** Soft-nav plate settle — subtle so it never reads as a route hold. */
  heroPlateScaleNav: 1.02,
  scroll: {
    revealStart: "top 88%",
    ctaStart: "top 82%",
  },
  lenis: {
    lerp: 0.08,
    wheelMultiplier: 0.9,
  },
  scrubY: "-6rem",
} as const;

export const MOTION_REFRESH_EVENT = "fisheye:motion-refresh";

export function requestMotionRefresh() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(MOTION_REFRESH_EVENT));
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
