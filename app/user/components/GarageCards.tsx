"use client";
import { useState } from "react";
import EVIllustration from "./EVIllustration";

const garages = [
  { name: "Banani Garage", location: "Banani, Dhaka", description: "Premium car servicing and maintenance.", image: "/images/banani.jpg" },
  { name: "Dhanmondi Garage", location: "Dhanmondi, Dhaka", description: "Complete vehicle repair and servicing.", image: "/images/dhanmondi.jpg" },
  { name: "Uttara Garage", location: "Uttara, Dhaka", description: "Fast and reliable car maintenance.", image: "/images/uttara.jpg" },
];
function GarageImage({ image, name }: { image: string; name: string }) {
  const [failed, setFailed] = useState(false);
  return <figure className="h-48 overflow-hidden bg-emerald-50">
    {failed ? <div className="w-56"><EVIllustration /></div> :
      <img src={image} alt={name} className="h-full w-full object-cover" onError={() => setFailed(true)} />}
  </figure>;
}
export default function GarageCards() {
  return <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8" aria-labelledby="garages-title">
    <p className="text-xs font-semibold tracking-widest text-primary">GARAGE DIRECTORY</p>
    <h2 id="garages-title" className="mt-3 text-3xl font-semibold">Garages around Dhaka</h2>
    <div className="mt-7 grid gap-5 md:grid-cols-3">
      {garages.map(garage => <article key={garage.name} className="dui-card overflow-hidden border border-base-300 bg-white">
        <GarageImage image={garage.image} name={garage.name} />
        <div className="dui-card-body">
          <h3 className="dui-card-title">{garage.name}</h3>
          <p className="text-sm font-medium text-primary">{garage.location}</p>
          <p className="text-sm leading-6 text-base-content/65">{garage.description}</p>
        </div>
      </article>)}
    </div>
  </section>;
}
