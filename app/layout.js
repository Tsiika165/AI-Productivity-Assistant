import "./globals.css";
import { IBM_Plex_Sans } from "next/font/google";

const plex = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-plex" });

export const metadata = {
  title: "HR Desk Assistant",
  description: "AI-powered workplace productivity assistant for HR administrators",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${plex.variable} font-sans`}>{children}</body>
    </html>
  );
}
