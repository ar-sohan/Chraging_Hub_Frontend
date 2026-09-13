"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function UserDock({ userId }: { userId: number }) {
  const pathname = usePathname();
  const links = [
    { label: "Home", href: "/user/dashboard", active: pathname === "/user/dashboard", icon: "home" },
    { label: "Bookings", href: "/user/bookings", active: pathname.startsWith("/user/bookings"), icon: "bookings" },
    { label: "Profile", href: "/user/profile/" + userId, active: pathname.startsWith("/user/profile") || pathname === "/user/change-password", icon: "profile" },
  ];
  return (
    <nav className="dui-dock user-header-dock bg-base-100 text-base-content" aria-label="Quick navigation">
      {links.map(item => (
        <Link key={item.href} href={item.href} aria-current={item.active ? "page" : undefined}
          className={item.active ? "dui-dock-active text-primary" : "text-base-content/60"}>
          <svg className="size-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {item.icon === "home" ? <>
              <path d="M2 11 12 2l10 9M5 13v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7M12 22v-4" />
            </> : item.icon === "bookings" ? <>
              <rect x="3" y="4" width="18" height="17" rx="2" />
              <path d="M7 2v4M17 2v4M3 10h18m-13 5 3 3 5-5" />
            </> : <>
              <circle cx="12" cy="8" r="4" /><path d="M4 22v-2a8 8 0 0 1 16 0v2" />
            </>}
          </svg>
          <span className="dui-dock-label">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}


