import { Geist } from "next/font/google";
import "./globals.css";
import SiteShell from "@/components/SiteShell";
import Script from "next/script";
import { getSiteSettings } from "@/lib/sanity.queries";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "Skating Club of San Francisco",
  description: "Supporting figure skaters of all levels in San Francisco. Join our community of skaters, coaches, and families.",
};

// Applies to every page in the app unless a page overrides it. Without this,
// pages that fetch Sanity data (which is most of them) get statically built
// once and frozen — Sanity edits then only show up after the next code
// deploy, not when you hit "Publish" in Studio. This makes Next.js re-fetch
// from Sanity in the background at most once every 60 seconds per page, so
// published changes go live within a minute without needing a deploy.
export const revalidate = 60;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const analyticsId = settings.googleAnalyticsId?.match(/^G-[A-Z0-9]+$/)?.[0];

  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <SiteShell>{children}</SiteShell>
        {analyticsId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || []; function gtag(){window.dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', ${JSON.stringify(analyticsId)});`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
