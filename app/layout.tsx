import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";

const kanit = Kanit({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-kanit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "คู่มือเทียบราคาค่าจ้างที่ปรึกษา | ว16",
  description: "ค้นหาและดูตารางอัตราเงินเดือนพื้นฐานและ Markup Factor ตามหลักเกณฑ์ราคากลางการจ้างที่ปรึกษา ว16",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="th" className={kanit.variable}><body>{children}</body></html>;
}
