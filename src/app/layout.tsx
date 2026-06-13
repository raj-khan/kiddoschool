import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";

import {
  BUILDER_NAME,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL
} from "@/lib/site";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: BUILDER_NAME }],
  keywords: [
    "homeschool app for kids",
    "Montessori learning app",
    "early learning ages 3 to 6",
    "phonics for kids",
    "reading and tracing for children",
    "preschool learning",
    "calm kids app",
    "movable alphabet",
    "early childhood education",
    "family learning app",
    "browser learning tool",
    "free kids app"
  ],
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} social preview`
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/twitter-image"]
  }
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
