export default function Footer() {
  return (
    <footer className="mt-auto bg-neutral text-neutral-content">
      <div className="dui-footer mx-auto max-w-7xl gap-10 px-6 py-10 sm:dui-footer-horizontal sm:px-8">
        <aside className="max-w-xs">
          <p className="text-xl font-bold tracking-tight">Charger Hub<span className="text-emerald-400">.</span></p>
          <p className="leading-6 text-neutral-content/70">
            Your charging, all in one place.<br />
            Book a slot and manage your charging journey.
          </p>
        </aside>
        <section aria-label="Services">
          <h6 className="dui-footer-title">Services</h6>
          <span>EV charging</span>
          <span>Slot booking</span>
          <span>Payment management</span>
        </section>
        <section aria-label="Company">
          <h6 className="dui-footer-title">Company</h6>
          <span>About us</span>
          <span>Contact</span>
        </section>
        <section aria-label="Legal">
          <h6 className="dui-footer-title">Legal</h6>
          <span>Terms of use</span>
          <span>Privacy policy</span>
          <span>Cookie policy</span>
        </section>
      </div>
      <div className="mx-auto max-w-7xl border-t border-white/15 px-6 py-5 text-xs text-neutral-content/60 sm:px-8">
        © {new Date().getFullYear()} Charger Hub. All rights reserved.
      </div>
    </footer>
  );
}
