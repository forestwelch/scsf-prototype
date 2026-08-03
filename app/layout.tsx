import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
