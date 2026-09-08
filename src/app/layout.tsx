import type { Metadata } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteMotion } from "@/components/SiteMotion";

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FISHEYE Architecture & Design: Interior Design in Marbella",
    template: "%s - FISHEYE",
  },
  description:
    "Timeless, technology-ready interiors for villas and luxury apartments in Marbella. Design, author’s supervision, and FF&E procurement.",
  metadataBase: new URL("https://fisheye-interior.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable}`}
    >
      <body>
        <SiteMotion>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
        </SiteMotion>
      </body>
    </html>
  );
}
