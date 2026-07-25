import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Toaster } from "@/components/Toaster";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: "ClearNotes — Less Reading. More Understanding.",
  description:
  "Upload a document and get organized notes that help you find what matters faster.",
  applicationName: "ClearNotes",
  alternates: {
    canonical: "/",
  },
  // iOS PWA support
  appleWebApp: {
    capable: true,
    title: "ClearNotes",
    statusBarStyle: "black-translucent",
    startupImage: ["/icon-512x512.png"],
  },
  openGraph: {
    type: "website",
    title: "ClearNotes — Less Reading. More Understanding.",
  description:
  "Upload a document and get organized notes that help you find what matters faster.",
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
    title: "ClearNotes — Less Reading. More Understanding.",
   description:
  "Upload a document and get organized notes that help you find what matters faster.",
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
        poppins.variable,
      )}
    >
      <head>
        {/* Apple touch icon for iOS home screen */}
        <link rel="apple-touch-icon" href="/icon-512x512.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192x192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#C49A3C" />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
            <ServiceWorkerRegistration />
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
            <Toaster />
            {children}
      
        </ThemeProvider>
      </body>
      
    </html>
  );
}
