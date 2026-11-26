"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import NotificationBell from "./NotificationBell";
import UserDock from "./UserDock";

type HeaderProps = { user?: { id: number }; onLogout?: () => void };

export default function Header({ user, onLogout }: HeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    const outside = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setMenuOpen(false); toggleRef.current?.focus(); }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [menuOpen]);
  const links = user ? [
    { label: "Dashboard", href: "/user/dashboard" },
    { label: "Book Slot", href: "/user/bookings/new" },
    { label: "My Bookings", href: "/user/bookings" },
    { label: "Payments", href: "/user/payments" },
    { label: "Profile", href: "/user/profile/" + user.id },
  ] : [
    { label: "Login", href: "/user/login" },
    { label: "Registration", href: "/user/registration" },
  ];
  const active = (href: string) => pathname === href ||
    (href === "/user/bookings" && pathname.startsWith(href + "/") && pathname !== "/user/bookings/new") ||
    (href === "/user/payments" && pathname.startsWith(href + "/")) ||
    (href.startsWith("/user/profile/") && pathname === "/user/change-password");

  const menuLinks = links.map(link => (
    <li key={link.href}>
      <Link href={link.href} onClick={() => setMenuOpen(false)}
        aria-current={active(link.href) ? "page" : undefined}
        className={active(link.href) ? "dui-menu-active font-semibold" : ""}>
        {link.label}
      </Link>
    </li>
  ));

  return (
    <header ref={headerRef} id="user-header" data-theme="light" className="ev-green relative border-b border-gray-200 bg-white text-gray-900">
      <div className="dui-navbar mx-auto max-w-7xl flex-wrap gap-2 px-4 py-3 sm:px-8 lg:flex-nowrap">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <button type="button" ref={toggleRef} className="dui-btn dui-btn-ghost dui-btn-square"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen} aria-controls="user-navigation-menu"
            onClick={() => setMenuOpen(value => !value)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d={menuOpen ? "M6 6l12 12M6 18L18 6" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
          <Link href={user ? "/user/dashboard" : "/user"} onClick={() => setMenuOpen(false)}
            className="portal-brand whitespace-nowrap text-lg font-bold tracking-tight sm:text-xl">
              <span className="portal-brand-mark" aria-hidden="true">
                <svg width="18" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 5 14h6l-1 8 9-13h-6l1-7Z" /></svg>
              </span>
              Charger Hub<span className="text-primary">.</span>
            </Link>
        </div>



        <div className="ml-auto flex items-center gap-2">
          {user && <>
            <UserDock userId={user.id} />
            <NotificationBell key={user.id} userId={user.id} onUnauthorized={onLogout} />
            <button type="button" onClick={onLogout}
              className="dui-btn dui-btn-ghost dui-btn-sm hidden sm:inline-flex"><svg className="size-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4M14 8l4 4-4 4M8 12h13" /></svg><span>Logout</span></button>
          </>}
        </div>

        {menuOpen && <nav id="user-navigation-menu" className="absolute left-4 top-full z-40 mt-2 w-60 rounded-xl border border-gray-200 bg-white p-2 shadow-lg sm:left-10" aria-label="User navigation">
          <ul className="dui-menu w-full gap-1">
            {menuLinks}
            {user && <li className="sm:hidden"><button onClick={onLogout}><svg className="size-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4M14 8l4 4-4 4M8 12h13" /></svg><span>Logout</span></button></li>}
          </ul>
        </nav>}
      </div>
    </header>
  );
}










