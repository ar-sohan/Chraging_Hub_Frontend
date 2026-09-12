export default function PageIntro({ title, description, eyebrow = "YOUR CHARGING SPACE" }: {
  title: string; description: string; eyebrow?: string;
}) {
  return <div className="mb-7 max-w-2xl">
    <p className="text-[11px] font-semibold tracking-[0.18em] text-primary">{eyebrow}</p>
    <h1 className="mt-3 text-3xl font-bold tracking-[-0.035em] sm:text-4xl">{title}</h1>
    <p className="mt-3 text-sm leading-6 text-base-content/65 sm:text-base">{description}</p>
  </div>;
}
