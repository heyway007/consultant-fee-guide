import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "คู่มือเทียบราคาค่าจ้างที่ปรึกษา | ว16",
  description: "ค้นหาและดูตารางอัตราเงินเดือนพื้นฐานและ Markup Factor ตามหลักเกณฑ์ราคากลางการจ้างที่ปรึกษา ว16",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="th"><body>{children}</body></html>;
}
