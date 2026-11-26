"use client";
import { useEffect, useState } from "react";

export default function Carousel() {
    
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Build Your Future",
      description: "Create powerful software solutions with modern technologies.",
      button: "Get Started",
      image: "/images/hero1.jpg",
    },
    {
      title: "Learn. Build. Grow.",
      description: "Improve your skills and turn your ideas into real products.",
      button: "Explore More",
      image: "/images/hero2.jpg",
    },
    {
      title: "Innovate With Technology",
      description: "Transform your ideas into scalable digital solutions.",
      button: "Learn More",
      image: "/images/hero3.jpg",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="w-full overflow-hidden">
      <div
        className="flex transition-transform duration-1000 ease-in-out"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
        }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="hero min-w-full min-h-[500px]">
            
            <div className="hero-overlay bg-opacity-60"></div>

            <div
              className="hero min-h-[500px]"
              style={{
                backgroundImage: `url(${slide.image})`,
              }}
            >
              <div className="hero-content text-center text-neutral-content">
                <div className="max-w-md">
                  <h1 className="mb-5 text-5xl font-bold">
                    {slide.title}
                  </h1>

                  <p className="mb-5">
                    {slide.description}
                  </p>

                  <button className="btn btn-primary">
                    {slide.button}
                  </button>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
