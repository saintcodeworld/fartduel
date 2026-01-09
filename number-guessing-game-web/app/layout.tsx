import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/components/WalletProvider";

const spaceMono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FARTDUEL - Terminal Duel Game",
  description: "Enter the terminal. Duel with numbers. Winner takes all.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={spaceMono.className}>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
