import { Analytics } from "@vercel/analytics/react";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const merriweather = Merriweather({
  subsets: ["latin"],
  display: "swap",
  weight: "300",
  variable: "--font-merriweather",
});

export const metadata = {
  title: "What Do I Know?",
  description: "a chatbot that asks *you* the questions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${merriweather.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
