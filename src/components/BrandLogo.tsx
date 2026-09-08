import Image from "next/image";

const LOGO = {
  ink: "/images/brand/logo-fisheye.png",
  white: "/images/brand/logo-fisheye-white.png",
} as const;

const SIZE = {
  /** ~28→32px — matches nav weight in a 4.5rem header */
  header:
    "h-7 w-auto max-w-[min(52vw,9rem)] object-contain object-left md:h-8 md:max-w-[10.5rem]",
  /** Slightly larger mark for the footer brand column */
  footer:
    "h-9 w-auto max-w-[12rem] object-contain object-left md:h-10 md:max-w-[13.5rem]",
} as const;

type BrandLogoProps = {
  /** ink = black (parchment); white = for dark bands; auto = ink + invert when header is transparent */
  variant?: keyof typeof LOGO | "auto";
  size?: keyof typeof SIZE;
  className?: string;
  priority?: boolean;
};

export function BrandLogo({
  variant = "ink",
  size = "header",
  className = "",
  priority = false,
}: BrandLogoProps) {
  const src = variant === "white" ? LOGO.white : LOGO.ink;
  const autoInvert =
    variant === "auto"
      ? "transition-[filter] duration-300 group-data-[solid=false]:invert"
      : "";

  return (
    <Image
      src={src}
      alt="FISHEYE Architecture & Design"
      width={1024}
      height={292}
      // Opt out of globals `img:not([data-img]) { height: auto }` so Tailwind heights stick
      data-img
      priority={priority}
      sizes="(max-width: 768px) 140px, 168px"
      className={`${SIZE[size]} ${autoInvert} ${className}`.trim()}
    />
  );
}
