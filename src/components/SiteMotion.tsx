"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import {
  MOTION_REFRESH_EVENT,
  motion,
  prefersReducedMotion,
} from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

type RevealVariant = "lift" | "lift-lg" | "clip";

const CLEAR_REVEAL = "transform,opacity,visibility,clipPath";

function revealVariant(node: HTMLElement): RevealVariant {
  const raw = (node.getAttribute("data-reveal") || "lift").trim();
  if (raw === "clip" || raw === "lift-lg") return raw;
  return "lift";
}

/** True when the node already intersects the reveal start band. */
function isAboveFold(node: HTMLElement): boolean {
  const rect = node.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
}

/**
 * Above-fold nodes must never start at opacity 0. ScrollTrigger can lag a
 * frame (Lenis init / layout), which made /projects look blank after hydrate.
 */
function revealAboveFold(node: HTMLElement, softNav: boolean) {
  node.dataset.revealed = "done";
  if (softNav) {
    gsap.set(node, { clearProps: CLEAR_REVEAL });
    return;
  }
  gsap.fromTo(
    node,
    { y: motion.distance.reveal * 0.35, autoAlpha: 0.92 },
    {
      y: 0,
      autoAlpha: 1,
      duration: motion.duration.reveal * 0.55,
      ease: motion.ease.out,
      clearProps: CLEAR_REVEAL,
      overwrite: true,
    }
  );
}

function markReduced(scope: HTMLElement) {
  scope
    .querySelectorAll<HTMLElement>(
      "[data-reveal], [data-reveal-child], [data-motion-chrome]"
    )
    .forEach((node) => {
      node.dataset.revealed = "done";
      gsap.set(node, { clearProps: CLEAR_REVEAL });
    });
}

/**
 * Site-wide motion spine: Lenis, plate scrub, hero settle, in-view reveals,
 * route enter, CTA bands. Soft navigations must feel immediate — no #main /
 * hero opacity hold, instant scroll reset, above-fold reveals skip on soft nav.
 */
export function SiteMotion({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const scrubbed = useRef(new WeakSet<Element>());
  const lenisRef = useRef<Lenis | null>(null);
  const isFirstMount = useRef(true);

  // Lenis once
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      lerp: motion.lenis.lerp,
      wheelMultiplier: motion.lenis.wheelMultiplier,
    });
    lenisRef.current = lenis;
    document.documentElement.classList.add("lenis", "lenis-smooth");
    lenis.on("scroll", ScrollTrigger.update);

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenisRef.current = null;
      lenis.destroy();
      document.documentElement.classList.remove("lenis", "lenis-smooth");
    };
  }, []);

  // Instant top on every soft route change (don't wait for Lenis lerp)
  useEffect(() => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const reduced = prefersReducedMotion();
    const softNav = !isFirstMount.current;
    isFirstMount.current = false;
    scrubbed.current = new WeakSet();

    let ctx: gsap.Context | null = null;
    let refreshTimer = 0;

    // Fresh route: allow main/footer reveals to bind again
    el.querySelectorAll<HTMLElement>(
      "[data-reveal], [data-reveal-child], [data-reveal-group], [data-motion-chrome], [data-cta-band], [data-hero]"
    ).forEach((node) => {
      delete node.dataset.revealed;
    });

    const bindScrub = (scope: HTMLElement) => {
      gsap.utils.toArray<HTMLElement>("[data-img-wrap]", scope).forEach((wrap) => {
        if (scrubbed.current.has(wrap)) return;
        const img = wrap.querySelector<HTMLElement>("[data-img]");
        if (!img) return;
        scrubbed.current.add(wrap);
        gsap.fromTo(
          img,
          { y: "0rem" },
          {
            y: motion.scrubY,
            ease: "none",
            scrollTrigger: {
              trigger: wrap,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
    };

    const bindRevealNode = (node: HTMLElement) => {
      if (node.dataset.revealed === "done" || node.dataset.revealed === "pending") {
        return;
      }
      if (node.closest("[data-reveal-group]")) return;

      // Hard + soft nav: never blank above-fold content waiting on ScrollTrigger
      if (isAboveFold(node)) {
        revealAboveFold(node, softNav);
        return;
      }

      const variant = revealVariant(node);
      node.dataset.revealed = "pending";

      if (variant === "clip") {
        gsap.fromTo(
          node,
          {
            clipPath: motion.clipFrom,
            autoAlpha: motion.opacityFrom,
            y: motion.distance.reveal * 0.35,
          },
          {
            clipPath: motion.clipTo,
            autoAlpha: 1,
            y: 0,
            duration: motion.duration.revealLg,
            ease: motion.ease.out,
            clearProps: CLEAR_REVEAL,
            scrollTrigger: {
              trigger: node,
              start: motion.scroll.revealStart,
              once: true,
              onEnter: () => {
                node.dataset.revealed = "done";
              },
            },
          }
        );
        return;
      }

      const y =
        variant === "lift-lg"
          ? motion.distance.revealLg
          : motion.distance.reveal;

      gsap.fromTo(
        node,
        { y, autoAlpha: motion.opacityFrom },
        {
          y: 0,
          autoAlpha: 1,
          duration: motion.duration.reveal,
          ease: motion.ease.out,
          clearProps: CLEAR_REVEAL,
          scrollTrigger: {
            trigger: node,
            start: motion.scroll.revealStart,
            once: true,
            onEnter: () => {
              node.dataset.revealed = "done";
            },
          },
        }
      );
    };

    const bindGroups = (scope: HTMLElement) => {
      gsap.utils
        .toArray<HTMLElement>("[data-reveal-group]", scope)
        .forEach((group) => {
          if (group.dataset.revealed === "done" || group.dataset.revealed === "pending") {
            return;
          }
          const kids = group.querySelectorAll<HTMLElement>("[data-reveal-child]");
          if (!kids.length) return;

          if (isAboveFold(group)) {
            group.dataset.revealed = "done";
            kids.forEach((k) => revealAboveFold(k, softNav));
            return;
          }

          group.dataset.revealed = "pending";
          kids.forEach((k) => {
            k.dataset.revealed = "pending";
          });
          gsap.fromTo(
            kids,
            { y: motion.distance.reveal, autoAlpha: motion.opacityFrom },
            {
              y: 0,
              autoAlpha: 1,
              duration: motion.duration.reveal,
              stagger: motion.stagger.tight,
              ease: motion.ease.out,
              clearProps: CLEAR_REVEAL,
              scrollTrigger: {
                trigger: group,
                start: motion.scroll.revealStart,
                once: true,
                onEnter: () => {
                  group.dataset.revealed = "done";
                  kids.forEach((k) => {
                    k.dataset.revealed = "done";
                  });
                },
              },
            }
          );
        });
    };

    const bindChrome = (scope: HTMLElement) => {
      gsap.utils
        .toArray<HTMLElement>("[data-motion-chrome]", scope)
        .forEach((node) => {
          if (node.dataset.revealed === "done" || node.dataset.revealed === "pending") {
            return;
          }
          if (isAboveFold(node)) {
            revealAboveFold(node, softNav);
            return;
          }
          node.dataset.revealed = "pending";
          gsap.fromTo(
            node,
            { y: motion.distance.chrome, autoAlpha: motion.opacityFrom },
            {
              y: 0,
              autoAlpha: 1,
              duration: motion.duration.reveal,
              ease: motion.ease.out,
              clearProps: CLEAR_REVEAL,
              scrollTrigger: {
                trigger: node,
                start: "top 92%",
                once: true,
                onEnter: () => {
                  node.dataset.revealed = "done";
                },
              },
            }
          );
        });
    };

    const bindCtaBands = (scope: HTMLElement) => {
      gsap.utils.toArray<HTMLElement>("[data-cta-band]", scope).forEach((cta) => {
        if (cta.dataset.revealed === "done" || cta.dataset.revealed === "pending") {
          return;
        }
        const parts = cta.querySelectorAll("[data-cta-el]");
        if (!parts.length) return;

        if (isAboveFold(cta)) {
          cta.dataset.revealed = "done";
          parts.forEach((part) => {
            if (part instanceof HTMLElement) revealAboveFold(part, softNav);
          });
          return;
        }

        cta.dataset.revealed = "pending";
        gsap.fromTo(
          parts,
          { y: motion.distance.cta, autoAlpha: motion.opacityFrom },
          {
            y: 0,
            autoAlpha: 1,
            duration: motion.duration.revealLg,
            stagger: motion.stagger.base,
            ease: motion.ease.out,
            clearProps: CLEAR_REVEAL,
            scrollTrigger: {
              trigger: cta,
              start: motion.scroll.ctaStart,
              once: true,
              onEnter: () => {
                cta.dataset.revealed = "done";
              },
            },
          }
        );
      });
    };

    const bindHero = (scope: HTMLElement, { snappy }: { snappy: boolean }) => {
      const hero = scope.querySelector("[data-hero]");
      if (!hero || (hero as HTMLElement).dataset.revealed === "done") return;
      (hero as HTMLElement).dataset.revealed = "done";

      const parts = hero.querySelectorAll("[data-hero-el]");
      const plate = hero.querySelector("[data-hero-plate]");

      // Soft nav: never dim hero copy — React already painted it. Keep only a
      // light plate settle so route changes feel instant.
      if (snappy) {
        parts.forEach((part) => {
          if (part instanceof HTMLElement) {
            gsap.set(part, { clearProps: CLEAR_REVEAL });
          }
        });
        if (plate) {
          gsap.fromTo(
            plate,
            { scale: motion.heroPlateScaleNav },
            {
              scale: 1,
              duration: motion.duration.heroPlateNav,
              ease: motion.ease.settle,
            }
          );
        }
        return;
      }

      if (parts.length) {
        gsap.fromTo(
          parts,
          {
            y: motion.distance.hero,
            autoAlpha: motion.opacityFrom,
          },
          {
            y: 0,
            autoAlpha: 1,
            duration: motion.duration.hero,
            stagger: motion.stagger.hero,
            ease: motion.ease.out,
            delay: 0.08,
            clearProps: CLEAR_REVEAL,
          }
        );
      }
      if (plate) {
        gsap.fromTo(
          plate,
          { scale: motion.heroPlateScale },
          {
            scale: 1,
            duration: motion.duration.heroPlate,
            ease: motion.ease.settle,
          }
        );
      }
    };

    const bindAll = (
      scope: HTMLElement,
      { pageEnter }: { pageEnter: boolean }
    ) => {
      if (reduced) {
        markReduced(scope);
        return;
      }

      if (pageEnter) {
        const main = scope.querySelector<HTMLElement>("#main");
        if (main) {
          // Kill any leftover page tween so rapid nav never stacks
          gsap.killTweensOf(main);
          if (softNav) {
            // Soft nav: do not re-dim #main after paint — that was the lag.
            gsap.set(main, { clearProps: CLEAR_REVEAL });
          } else {
            gsap.fromTo(
              main,
              {
                y: motion.distance.page,
                autoAlpha: motion.pageOpacityFrom,
              },
              {
                y: 0,
                autoAlpha: 1,
                duration: motion.duration.page,
                ease: motion.ease.out,
                clearProps: CLEAR_REVEAL,
                overwrite: true,
              }
            );
          }
        }
        bindHero(scope, { snappy: softNav });
      }

      bindScrub(scope);
      bindCtaBands(scope);
      bindGroups(scope);
      bindChrome(scope);
      gsap.utils
        .toArray<HTMLElement>("[data-reveal]", scope)
        .forEach(bindRevealNode);
      ScrollTrigger.refresh();
    };

    ctx = gsap.context(() => {
      bindAll(el, { pageEnter: true });
    }, el);

    const onRefresh = () => {
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => {
        ScrollTrigger.getAll().forEach((t) => {
          const trigger = t.trigger;
          if (trigger && trigger instanceof Element && !document.body.contains(trigger)) {
            t.kill();
          }
        });
        ctx?.add(() => {
          bindAll(el, { pageEnter: false });
        });
      }, 40);
    };

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);
    window.addEventListener(MOTION_REFRESH_EVENT, onRefresh);

    return () => {
      window.clearTimeout(refreshTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener(MOTION_REFRESH_EVENT, onRefresh);
      // #main persists across routes — revert must not leave it invisible
      const main = el.querySelector<HTMLElement>("#main");
      if (main) {
        gsap.killTweensOf(main);
        gsap.set(main, { clearProps: CLEAR_REVEAL });
      }
      ctx?.revert();
      if (main) {
        gsap.set(main, { clearProps: CLEAR_REVEAL });
      }
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [pathname]);

  return (
    <div ref={root} data-site-motion="">
      {children}
    </div>
  );
}
