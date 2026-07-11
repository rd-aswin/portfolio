import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "R D Aswin | Software Engineer & Resilient Systems Architect",
  description: "Official portfolio of R D Aswin, a software developer and engineer specializing in resilient systems, distributed engines, and high-performance WebGL/Next.js frontend applications.",
  keywords: [
    "R D Aswin",
    "Aswin",
    "Software Engineer",
    "Software Developer",
    "Jawahar Navodaya Vidyalaya",
    "Kollam",
    "Kerala",
    "Distributed Systems",
    "System Design",
    "WebGL",
    "Next.js",
    "React Portfolio",
    "Resilient Systems"
  ],
  authors: [{ name: "R D Aswin", url: "https://rdaswin.isroot.in" }],
  creator: "R D Aswin",
  alternates: {
    canonical: "https://rdaswin.isroot.in",
  },
  openGraph: {
    title: "R D Aswin | Software Engineer & Resilient Systems Architect",
    description: "Official portfolio of R D Aswin, a software developer specializing in distributed systems design and interactive WebGL experiences.",
    url: "https://rdaswin.isroot.in",
    siteName: "R D Aswin Portfolio",
    type: "profile",
    firstName: "Aswin",
    lastName: "R D",
    username: "rd-aswin",
    images: [
      {
        url: "https://rdaswin.isroot.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "R D Aswin Portfolio Cover",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "R D Aswin | Software Engineer & Resilient Systems Architect",
    description: "Official portfolio of R D Aswin. Specializing in high-performance web engineering and distributed consensus.",
    images: ["https://rdaswin.isroot.in/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "R D Aswin",
    "givenName": "Aswin",
    "familyName": "R D",
    "url": "https://rdaswin.isroot.in",
    "image": "https://rdaswin.isroot.in/og-image.png",
    "description": "Software developer and engineer specializing in Next.js, React, distributed engines, and modern systems architecture.",
    "jobTitle": "Software Developer",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Kollam",
      "addressRegion": "Kerala",
      "addressCountry": "India"
    },
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": "Jawahar Navodaya Vidyalaya"
    },
    "sameAs": [
      "https://in.linkedin.com/in/rd-aswin",
      "https://github.com/rd-aswin"
    ],
    "knowsAbout": [
      "Software Engineering",
      "Next.js",
      "React",
      "TypeScript",
      "JavaScript",
      "System Design",
      "WebGL",
      "Framer Motion",
      "GSAP"
    ]
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
