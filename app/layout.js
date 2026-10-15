
import "./globals.css";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import ThemeProvider from "@/components/ThemeProvider";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata = {
  title: "HR Desk Assistant",
  description:
    "AI-powered workplace productivity assistant for HR administrators",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${display.variable} ${body.variable} ${mono.variable} font-sans`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
