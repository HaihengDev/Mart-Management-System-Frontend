import { useEffect, useMemo, useState } from 'react';
import { HeroImage } from '../data/data.js';
import SlideCard from './SlideCard.jsx';

const AUTO_SLIDE_MS = 3500;

export default function Hero() {
  const slides = useMemo(
    () =>
      HeroImage.map((item) => ({
        ...item,
        imgUrl: item.imgUrl ?? item.imgurl ?? '',
      })).filter((item) => item.imgUrl),
    [],
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return undefined;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, AUTO_SLIDE_MS);

    return () => clearInterval(timer);
  }, [slides.length]);

  if (!slides.length) return null;

  const goToSlide = (index) => {
    const nextIndex = (index + slides.length) % slides.length;
    setCurrentIndex(nextIndex);
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-4 pt-6 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-2xl bg-slate-100 shadow-md">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide) => (
            <SlideCard key={slide.id} name={slide.name} imgUrl={slide.imgUrl} />
          ))}
        </div>

        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goToSlide(currentIndex - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/85 px-3 py-2 text-lg font-bold text-slate-800 shadow hover:bg-white"
              aria-label="Previous slide"
            >
              &#10094;
            </button>
            <button
              type="button"
              onClick={() => goToSlide(currentIndex + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/85 px-3 py-2 text-lg font-bold text-slate-800 shadow hover:bg-white"
              aria-label="Next slide"
            >
              &#10095;
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goToSlide(index)}
                  className={`h-2.5 w-2.5 rounded-full transition ${
                    currentIndex === index ? 'bg-white' : 'bg-white/50'
                  }`}
                  aria-label={`Go to ${slide.name}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
