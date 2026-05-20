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
  metadataBase: new URL("https://aphantasia.vercel.app"),
  title: "Aphantasia Profile Test",
  description:
    "시각 심상, 공간 지각, 안면 인식 경향을 확인하는 자가점검용 Aphantasia 테스트",
  openGraph: {
    title: "Aphantasia Profile Test",
    description:
      "짧은 문항으로 시각 심상, 공간 지각, 안면 인식 경향을 확인하고 결과를 이미지/PDF로 저장합니다.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
