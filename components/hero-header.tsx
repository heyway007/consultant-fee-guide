"use client";

import Image from "next/image";
import { useEffect, useSyncExternalStore } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

type Theme = "light" | "dark";

const themeStorageKey = "consultant-fee-theme";

function getStoredTheme(): Theme {
  return window.localStorage.getItem(themeStorageKey) === "dark" ? "dark" : "light";
}

function subscribeToTheme(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener("consultant-theme-change", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("consultant-theme-change", onChange);
  };
}

function getServerTheme(): Theme {
  return "light";
}

export default function HeroHeader() {
  const theme = useSyncExternalStore(subscribeToTheme, getStoredTheme, getServerTheme);
  const isDark = theme === "dark";

  useEffect(() => {
    if (isDark) document.documentElement.dataset.theme = "dark";
    else delete document.documentElement.dataset.theme;
  }, [isDark]);

  const toggleTheme = () => {
    const nextTheme: Theme = isDark ? "light" : "dark";
    window.localStorage.setItem(themeStorageKey, nextTheme);
    if (nextTheme === "dark") document.documentElement.dataset.theme = "dark";
    else delete document.documentElement.dataset.theme;
    window.dispatchEvent(new Event("consultant-theme-change"));
  };

  return (
    <header className="hero-section">
      <div className="hero-content hero-title-only">
        <div className="hero-header-row">
          <div className="hero-brand">
            <div className="hero-logo-frame">
              <Image src="/tceb-logo.webp" alt="โลโก้ TCEB" width={72} height={72} priority />
            </div>
            <h1>คู่มือเทียบราคาค่าจ้างที่ปรึกษา</h1>
          </div>
          <button type="button" className="theme-toggle" aria-label={isDark ? "เปิดโหมดสว่าง" : "เปิดโหมดมืด"} aria-pressed={isDark} onClick={toggleTheme}>
            <FontAwesomeIcon icon={isDark ? faSun : faMoon} aria-hidden="true" />
            <span>{isDark ? "โหมดสว่าง" : "โหมดมืด"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
