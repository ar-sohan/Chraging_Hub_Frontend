export default function Footer() {
  return (
    <footer className="mt-auto px-4 sm:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-2 border-t border-base-300 py-5 text-xs text-base-content/50">
        <p>Charger Hub</p>
        <p>© {new Date().getFullYear()} Charger Hub. All rights reserved.</p>
      </div>
    </footer>
  );
}
