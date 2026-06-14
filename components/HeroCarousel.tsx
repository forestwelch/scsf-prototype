'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { HeroSlide } from '@/lib/sanity.queries';

export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => setCurrent(c => (c + 1) % slides.length), [slides.length]);
  const prev = useCallback(() => setCurrent(c => (c - 1 + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (isPaused || slides.length < 2) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [isPaused, next, slides.length]);

  if (slides.length === 0) return null;

  const slide = slides[current];

  return (
    <section
      className="relative h-[560px] md:h-[640px] overflow-hidden bg-brand-royal-blue"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Hero image carousel"
    >
      {/* Slides */}
      {slides.map((s, i) => (
        <div
          key={s._id}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          aria-hidden={i !== current}
        >
          <Image
            src={s.imageUrl}
            alt={s.imageAlt ?? s.headline}
            fill
            className="object-cover"
            priority={i === 0}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </div>
      ))}

      {/* Text overlay */}
      <div className="relative z-20 h-full flex flex-col justify-end pb-16 px-6 md:px-16 max-w-4xl">
        {slide.category && (
          <span className="inline-block bg-brand-golden-yellow text-brand-charcoal text-xs font-bold uppercase tracking-widest px-3 py-1 rounded mb-3 w-fit">
            {slide.category}
          </span>
        )}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 drop-shadow-lg">
          {slide.headline}
        </h1>
        {slide.subtitle && (
          <p className="text-lg md:text-xl text-white/85 mb-6 drop-shadow max-w-xl">
            {slide.subtitle}
          </p>
        )}
        <div className="flex gap-4">
          {slide.ctaLabel && slide.ctaHref && (
            <Link
              href={slide.ctaHref}
              className="bg-brand-golden-yellow text-brand-charcoal px-6 py-3 rounded-md font-semibold hover:bg-yellow-400 transition-colors"
            >
              {slide.ctaLabel}
            </Link>
          )}
          <Link
            href="/membership"
            className="border-2 border-white text-white px-6 py-3 rounded-md font-semibold hover:bg-white hover:text-brand-royal-blue transition-colors"
          >
            Join the Club
          </Link>
        </div>
      </div>

      {/* Prev / Next arrows */}
      {slides.length > 1 && (
        <>
          <button onClick={prev} aria-label="Previous slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={next} aria-label="Next slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dot indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'bg-brand-golden-yellow w-6' : 'bg-white/50 w-2 hover:bg-white/80'}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
