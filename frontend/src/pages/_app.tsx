import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "sonner";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} font-[family-name:var(--font-geist-sans)]`}>
      <Component {...pageProps} />
      <Toaster position="top-right" richColors />
    </div>
  );
}