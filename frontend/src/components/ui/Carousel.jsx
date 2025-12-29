import { useState, useEffect, useCallback, Children, cloneElement } from 'react';

const Carousel = ({ children, itemsToShow = 3, autoPlay = true, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const totalItems = Children.count(children);

  const nextSlide = useCallback(() => {
    setCurrentIndex(prev =>
      prev >= totalItems - itemsToShow ? 0 : prev + 1
    );
  }, [totalItems, itemsToShow]);

  const prevSlide = () => {
    setCurrentIndex(prev =>
      prev <= 0 ? Math.max(0, totalItems - itemsToShow) : prev - 1
    );
  };

  // Auto-advance slides
  useEffect(() => {
    if (!autoPlay || isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, isPaused, interval, nextSlide]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      else if (e.key === 'ArrowLeft') prevSlide();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  return (
    <div
      className="relative w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`,
            width: `${(totalItems * 100) / itemsToShow}%`
          }}
        >
          {Children.map(children, (child, index) => (
            <div
              key={index}
              className="flex-shrink-0"
              style={{ width: `${100 / itemsToShow}%` }}
            >
              {cloneElement(child, { className: 'px-2' })}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 z-10"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 z-10"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: Math.ceil(totalItems / itemsToShow) }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i * itemsToShow)}
            className={`w-2 h-2 rounded-full transition-colors ${
              currentIndex >= i * itemsToShow && currentIndex < (i + 1) * itemsToShow 
                ? 'bg-primary-500' 
                : 'bg-neutral-300 dark:bg-neutral-600'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
