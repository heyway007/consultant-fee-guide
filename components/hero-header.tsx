import Image from "next/image";

export default function HeroHeader() {
  return (
    <header className="hero-section">
      <div className="hero-content hero-title-only">
        <div className="hero-brand">
          <div className="hero-logo-frame">
            <Image src="/tceb-logo.webp" alt="โลโก้ TCEB" width={72} height={72} priority />
          </div>
          <h1>คู่มือเทียบราคาค่าจ้างที่ปรึกษา</h1>
        </div>
      </div>
    </header>
  );
}
