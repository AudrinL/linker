import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import WhatsAppFab from "@/components/layout/WhatsAppFab";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Overseas Jobs, Visas, Safaris & Travel from Rwanda`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [
    "overseas jobs Rwanda",
    "work visa Rwanda",
    "travel agency Kigali",
    "Rwanda gorilla trekking safari",
    "vehicle import Rwanda",
    "international recruitment agency",
    "study visa assistance",
    "flight booking Kigali",
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: `${site.name} — Connecting Africa to the world`,
    description: site.description,
    images: [
      {
        url: "/img/hero-savanna.png",
        width: 1376,
        height: 768,
        alt: "An airliner crossing the East African savanna at golden hour",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Connecting Africa to the world`,
    description: site.description,
    images: ["/img/hero-savanna.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#03080f",
  colorScheme: "dark",
};

/** Organization schema — helps search engines render a rich business panel. */
const orgSchema = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: site.name,
  description: site.description,
  url: site.url,
  telephone: site.phones.map((p) => p.display),
  email: site.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: site.address.city,
    addressCountry: "RW",
  },
  areaServed: "Worldwide",
  sameAs: site.socials.map((s) => s.href),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} ${instrument.variable}`}
    >
      <body className="min-h-dvh antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <SmoothScroll />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[100] focus:rounded-full focus:bg-gold focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-abyss"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <WhatsAppFab />
      </body>
    </html>
  );
}
