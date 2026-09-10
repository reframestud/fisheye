"use client";

import { useEffect, useRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type HorizontalTrackProps = HTMLAttributes<HTMLDivElement>;

function wheelDeltaPx(event: WheelEvent): number {
  const scale =
    event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
  if (event.shiftKey) return event.deltaY * scale;
  if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
    return event.deltaX * scale;
  }
  return event.deltaY * scale;
}

/**
 * Horizontal scroller that still works while Lenis owns the page wheel.
 * Mouse wheel, click-drag, and arrow keys move the track; page scroll
 * resumes when the row is already at either end.
 */
export function HorizontalTrack({
  className,
  children,
  ...rest
}: HorizontalTrackProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let pointerId: number | null = null;
    let originX = 0;
    let originScroll = 0;
    let dragging = false;

    const overflow = () => el.scrollWidth - el.clientWidth;

    const onWheel = (event: WheelEvent) => {
      const max = overflow();
      if (max <= 1) return;

      const delta = wheelDeltaPx(event);
      if (delta === 0) return;

      const next = Math.min(max, Math.max(0, el.scrollLeft + delta));
      if (next === el.scrollLeft) return;

      event.preventDefault();
      event.stopPropagation();
      el.scrollLeft = next;
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "touch" || event.button !== 0) return;
      if (overflow() <= 1) return;
      pointerId = event.pointerId;
      originX = event.clientX;
      originScroll = el.scrollLeft;
      dragging = false;
      el.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;
      const dx = event.clientX - originX;
      if (!dragging) {
        if (Math.abs(dx) < 6) return;
        dragging = true;
        el.classList.add("is-dragging");
      }
      el.scrollLeft = originScroll - dx;
    };

    const endPointer = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;
      pointerId = null;
      if (dragging) {
        el.classList.remove("is-dragging");
      }
      dragging = false;
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const max = overflow();
      if (max <= 1) return;
      const step = Math.round(el.clientWidth * 0.72);
      let left: number | null = null;
      if (event.key === "ArrowRight") left = el.scrollLeft + step;
      else if (event.key === "ArrowLeft") left = el.scrollLeft - step;
      else if (event.key === "Home") left = 0;
      else if (event.key === "End") left = max;
      if (left === null) return;
      event.preventDefault();
      el.scrollTo({ left, behavior: "smooth" });
    };

    const onDragStart = (event: DragEvent) => {
      event.preventDefault();
    };

    el.addEventListener("wheel", onWheel, { passive: false, capture: true });
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", endPointer);
    el.addEventListener("pointercancel", endPointer);
    el.addEventListener("keydown", onKeyDown);
    el.addEventListener("dragstart", onDragStart);

    return () => {
      el.removeEventListener("wheel", onWheel, { capture: true });
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", endPointer);
      el.removeEventListener("pointercancel", endPointer);
      el.removeEventListener("keydown", onKeyDown);
      el.removeEventListener("dragstart", onDragStart);
    };
  }, []);

  return (
    <div
      ref={ref}
      tabIndex={0}
      data-lenis-prevent-horizontal=""
      className={cn("horizontal-track", className)}
      {...rest}
    >
      {children}
    </div>
  );
}
