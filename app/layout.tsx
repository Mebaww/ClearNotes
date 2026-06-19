import type { Metadata } from "next";
import { Noto_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";

import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { GoogleAnalytics } from "@next/third-parties/google";


const instrumentSerifHeading = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-heading",
});

const notoSans = Noto_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "ClearNotes — Read less, Understand more",
  icons: {
    icon: "/logo.png",
  } ,
  description:
    "ClearNotes turns PDFs, slide decks, and Word documents into clear, structured notes for work and study.",
  applicationName: "ClearNotes",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    title: "ClearNotes — Read less, Understand more",
    description:
      "Turn PDFs, slide decks, and Word documents into clear, structured notes.",
    url: "/",
    siteName: "ClearNotes",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "ClearNotes social preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ClearNotes — Read less, Understand more",
    description:
      "Turn PDFs, slide decks, and Word documents into clear, structured notes.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "font-sans",
        notoSans.variable,
        instrumentSerifHeading.variable,
      )}
    >
      <head />
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
