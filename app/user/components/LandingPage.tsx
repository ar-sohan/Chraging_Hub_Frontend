import Link from "next/link";
import EVIllustration from "./EVIllustration";

function Mark() {
  return <span className="inline-flex items-center gap-2.5">
    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#005541]">
      <svg width="21" height="21" viewBox="0 0 24 24" aria-hidden="true"><path fill="#baff63" d="M10 3h7l-4 7h5l-7 11H8l4-9H6Z" /></svg>
    </span>
    <span className="text-xl font-bold tracking-tight text-[#111b29]">ChargeHub<span className="ml-2 text-[#009b70]">.</span></span>
  </span>;
}

export default function LandingPage({ portal = false }: { portal?: boolean }) {
  return (
    <div data-theme="light" className="ev-green min-h-screen bg-[#f8faf6] text-[#111b29]">
      <header className="border-b border-[#e5ebe4] bg-white">
        <div className="dui-navbar mx-auto max-w-7xl flex-wrap justify-between gap-3 px-5 py-5 sm:px-8">
          <Link href="/" aria-label="ChargeHub home"><Mark /></Link>
          <nav className="flex items-center gap-2 sm:gap-6" aria-label="Public navigation">
            <Link aria-current={!portal ? "page" : undefined} className={"dui-btn dui-btn-ghost dui-btn-sm hidden sm:inline-flex " + (!portal ? "text-primary" : "")} href="/">Home</Link>
            <Link aria-current={portal ? "page" : undefined} className={"dui-btn dui-btn-ghost dui-btn-sm " + (portal ? "text-primary" : "")} href="/user">User portal</Link>
            <Link href="/user/login" className="dui-btn rounded-full border-0 bg-[#002f25] px-5 text-white hover:bg-[#005541]">Log in ↗</Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div>
            <span className="dui-badge h-auto gap-2 rounded-full border-emerald-200 bg-emerald-50 px-3 py-2 text-[11px] font-semibold tracking-wider text-[#007b59]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {portal ? "YOUR CHARGING, ALL IN ONE PLACE" : "A BRIGHTER WAY TO MOVE"}
            </span>
            <h1 className="mt-7 text-[clamp(2.6rem,5.5vw,4.5rem)] font-bold leading-[1.08] tracking-[-0.055em]">
              {portal ? <>Your charge.<br />Your schedule.<br /><span className="text-[#00815d]">All in control.</span></> :
                <>Good energy.<br />Great journeys.<br /><span className="text-[#00815d]">Zero hassle.</span></>}
            </h1>
            <p className="mt-7 max-w-lg text-base leading-7 text-[#526575]">
              {portal ? "Choose an available slot, keep track of your bookings and get updates as they happen. Start with your ChargeHub account." :
                "Make charging the easiest part of your day. Your ChargeHub account is the first step toward a smoother electric journey."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={portal ? "/user/registration" : "/user"} className="dui-btn h-13 rounded-full border-0 bg-[#002f25] px-6 text-white hover:bg-[#005541]">
                {portal ? "Create your account" : "Explore user portal"} <span className="ml-3" aria-hidden="true">↗</span>
              </Link>
              <a href="#how-it-works" className="dui-btn dui-btn-outline h-13 rounded-full border-[#cad8d1] px-6 hover:bg-emerald-50 hover:text-[#002f25]">How it works ↓</a>
            </div>
            <p className="mt-6 text-xs text-[#758680]">Built for electric drivers. Designed around you.</p>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] bg-[#dcecdc] px-1 pb-5 pt-8 sm:px-5">
            <span className="absolute left-6 top-6 rounded-full bg-white/85 px-3 py-2 text-[10px] font-semibold tracking-wide sm:text-xs">ELECTRIC LOOKS GOOD ON YOU</span>
            <EVIllustration />
            <div className="absolute bottom-5 left-5 right-5 flex w-fit max-w-[calc(100%-2.5rem)] items-center gap-3 rounded-2xl border border-white bg-white/95 px-4 py-3 shadow-sm">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#d5ffa0] text-xl text-[#17432e]" aria-hidden="true">ϟ</span>
              <div><p className="text-sm font-semibold">Less waiting. More living.</p><p className="mt-1 text-xs text-[#6a7e8d]">Your next journey starts here.</p></div>
            </div>
          </div>
        </section>

        <div className="border-y border-[#d6e3d2] bg-[#edf3e8]">
          <div className="mx-auto grid max-w-7xl gap-5 px-5 py-6 text-sm sm:px-8 md:grid-cols-3">
            <p><span className="mr-3 text-primary" aria-hidden="true">ϟ</span>A simpler charging experience</p>
            <p><span className="mr-3 text-primary" aria-hidden="true">◎</span>Your account, all in one place</p>
            <p><span className="mr-3 text-primary" aria-hidden="true">↗</span>Made for your everyday journey</p>
          </div>
        </div>

        <section id="how-it-works" className="mx-auto max-w-7xl scroll-mt-6 px-5 py-16 sm:px-8 sm:py-20">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#007f5e]">PLUG INTO SOMETHING SIMPLE</p>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-5">
            <h2 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">A little setup. A lot more freedom.</h2>
            <Link className="text-sm font-semibold text-[#007f5e] hover:underline" href="/user/registration">Get started ↗</Link>
          </div>
          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {[
              {number:"01", title:"Make it yours", text:"Create your driver account with a few simple details."},
              {number:"02", title:"Find your spot", text:"Choose an available slot and manage your booking from one place."},
              {number:"03", title:"Stay in the know", text:"See your booking status and receive updates in your notification bell."},
            ].map(item => <article key={item.number} className="dui-card border border-[#dfe7ec] bg-white shadow-none">
              <div className="dui-card-body p-7"><span className="text-sm font-medium text-primary">{item.number} /</span>
                <h3 className="mt-5 text-xl font-semibold tracking-tight">{item.title}</h3>
                <p className="mt-1 text-sm leading-6 text-[#6a7e8d]">{item.text}</p>
              </div>
            </article>)}
          </div>
        </section>
      </main>

      <footer className="border-t border-[#e2e8ef] bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-7 text-sm sm:px-8">
          <p><span className="font-semibold">ChargeHub.</span><span className="ml-3 text-[#6a7e8d]">A better way to charge.</span></p>
          <div className="flex items-center gap-6"><span className="text-xs text-[#6a7e8d]">© {new Date().getFullYear()} ChargeHub</span>
            <Link href="/admin" className="text-xs text-[#6a7e8d] hover:text-primary">Admin portal ↗</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
