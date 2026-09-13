"use client";
import { useEffect, useState } from "react";

export default function ShowStations() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const garages = [
    {
      name: "Banani Garage",
      location: "Banani, Dhaka",
      description: "Premium car servicing and maintenance.",
      image: "/images/banani.jpg",
    },
    {
      name: "Dhanmondi Garage",
      location: "Dhanmondi, Dhaka",
      description: "Complete vehicle repair and servicing.",
      image: "/images/dhanmondi.jpg",
    },
    {
      name: "Uttara Garage",
      location: "Uttara, Dhaka",
      description: "Fast and reliable car maintenance.",
      image: "/images/uttara.jpg",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % garages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [garages.length]);

  return (
    <div className="carousel carousel-vertical rounded-box h-96 w-full">
      {garages.map((garage, index) => (
        <div
          key={index}
          className={`carousel-item h-full w-full ${
            index === currentSlide ? "block" : "hidden"
          }`}
        >
          <div
            className="hero h-full"
            style={{
              backgroundImage: `url(${garage.image})`,
            }}
          >
            <div className="hero-overlay"></div>

            <div className="hero-content text-center text-neutral-content">
              <div className="max-w-md">
                <h2 className="text-3xl font-bold">
                  {garage.name}
                </h2>

                <p className="py-2">
                  📍 {garage.location}
                </p>

                <p className="mb-4">
                  {garage.description}
                </p>

                <button className="btn btn-primary">
                  View Garage
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}