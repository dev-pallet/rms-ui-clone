import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useCallback, useEffect, useState } from 'react';
import './Carousel.css';

const Swipermarket = ({ images, showControls, showIndicators = true, effect = 'slide' }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = useCallback(() => {
    setActiveIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  }, [images.length]);

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowRight') {
      handleNext();
    } else if (event.key === 'ArrowLeft') {
      handlePrev();
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 4000);

    return () => clearInterval(timer);
  }, [handleNext]);

  return (
    <div
      className={`carousel-wrapper ${effect}`}
      onKeyDown={handleKeyDown}
      tabIndex="0"
      aria-live="polite"
      aria-roledescription="carousel"
    >
      <div
        className="carousel-items"
        style={
          effect === 'slide' ? { transform: `translateX(-${activeIndex * 100}%)` } : { transform: 'translateX(0)' }
        }
      >
        {images.map((image, index) => (
          <div key={index} className={`carousel-item ${index === activeIndex ? 'active' : ''}`}>
            <img src={image} alt={image} style={{ borderRadius: '10px !important' }} />
          </div>
        ))}
      </div>

      {showControls && (
        <>
          <button className="carousel-control prev" onClick={handlePrev} aria-label="Previous slide">
            <ChevronLeftIcon sx={{ fontSize: '18px' }} />
          </button>
          <button className="carousel-control next" onClick={handleNext} aria-label="Next slide">
            <KeyboardArrowRightIcon sx={{ fontSize: '18px' }} />
          </button>
        </>
      )}

      {showIndicators && (
        <div className="carousel-pagination">
          {images.map((_, index) => (
            <button
              key={index}
              className={`pagination-indicator ${index === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-selected={index === activeIndex}
            ></button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Swipermarket;
