import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import Footer from "@/components/layout/Footer";
import SiteChrome from "@/components/layout/SiteChrome";

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

// Display face. Poppins is a geometric sans, so headings carry weight rather
// than contrast — 500/600 do the work the serif used to do at 400.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}: Overseas Jobs, Study, Visas & Travel from Rwanda`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [
    "overseas jobs Rwanda",
    "work visa Rwanda",
    "travel agency Kigali",
    "study abroad Rwanda",
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
    title: `${site.name}: Connecting Africa to the world`,
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
    title: `${site.name}: Connecting Africa to the world`,
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
  themeColor: "#f7f4ee",
  colorScheme: "light",
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
      className={`${geist.variable} ${geistMono.variable} ${poppins.variable}`}
    >
      <body className="min-h-dvh antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        {/* Nav, footer and scroll smoothing live here for the public site and
            are dropped on /admin — see SiteChrome. */}
        <SiteChrome footer={<Footer />}>{children}</SiteChrome>
      </body>
    </html>
  );
}
