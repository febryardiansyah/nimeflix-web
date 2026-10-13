"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

export const NAV_ITEMS = [
  { href: "/", label: "Beranda", jp: "家" },
  { href: "/ongoing", label: "Ongoing", jp: "放送" },
  { href: "/complete", label: "Tamat", jp: "完結" },
  { href: "/genres", label: "Genre", jp: "種類" },
  { href: "/schedule", label: "Jadwal", jp: "予定" },
];

const base =
  "relative whitespace-nowrap px-3 py-2 text-sm font-medium tracking-wide transition-colors";

function ActiveLinks() {
  const pathname = usePathname();
  return NAV_ITEMS.map((item) => {
    const active =
      item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        aria-current={active ? "page" : undefined}
        className={`${base} ${active ? "text-cream" : "text-mute hover:text-cream"}`}
      >
        {item.label}
        {active && (
          <span className="absolute inset-x-3 -bottom-px h-0.5 bg-vermilion" />
        )}
      </Link>
    );
  });
}

function PlainLinks() {
  return NAV_ITEMS.map((item) => (
    <Link key={item.href} href={item.href} className={`${base} text-mute`}>
      {item.label}
    </Link>
  ));
}

export function NavLinks() {
  return (
    <Suspense fallback={<PlainLinks />}>
      <ActiveLinks />
    </Suspense>
  );
}
