import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SocketProvider } from "@/app/contexts/SocketContext";
import StructuredData from "@/app/components/StructuredData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZetaDuel - Multiplayer Arithmetic Game Like Zetamac | Mental Math Battle Arena",
  description: "Play the ultimate multiplayer arithmetic game inspired by Zetamac! Challenge opponents in fast-paced mental math battles. Practice addition, subtraction, multiplication, division online. Free arithmetic speed game.",
  keywords: "arithmetic game, zetamac, multiplayer math game, mental math, speed arithmetic, math battle, online math practice, addition subtraction multiplication division, math competition, brain training",
  authors: [{ name: "ZetaDuel Team" }],
  creator: "ZetaDuel",
  publisher: "ZetaDuel",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://zetaduel.vercel.app'), // Update with your actual domain
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "ZetaDuel - Multiplayer Arithmetic Game Like Zetamac",
    description: "Challenge opponents in fast-paced mental math battles. Free online arithmetic speed game with addition, subtraction, multiplication, division.",
    url: 'https://zetaduel.vercel.app',
    siteName: 'ZetaDuel',
    images: [
      {
        url: '/og-image.png', // We'll create this
        width: 1200,
        height: 630,
        alt: 'ZetaDuel - Multiplayer Arithmetic Game',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "ZetaDuel - Multiplayer Arithmetic Game Like Zetamac",
    description: "Challenge opponents in fast-paced mental math battles. Free online arithmetic speed game.",
    images: ['/og-image.png'],
    creator: '@zetaduel', // Update with your Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Add when you get it
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SocketProvider>
          {children}
        </SocketProvider>
        <StructuredData />
      </body>
    </html>
  );
}
