import { useEffect, useRef, useState } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';

export default function Counter({ value, direction = 'up' }) {
  const ref = useRef(null);
  const motionValue = useMotionValue(direction === 'down' ? value : 0);
  const springValue = useSpring(motionValue, {
    damping: 40,
    stiffness: 500,
  });
  const [isInView, setInView] = useState(false);
  const numberFormatOptions = {
    style: 'decimal',
    maximumFractionDigits: 0,
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setInView(entry.isIntersecting);
      },
      { once: true, rootMargin: '-100px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isInView) {
      motionValue.set(direction === 'down' ? 0 : value);
    }
  }, [motionValue, isInView]);

  useEffect(() => {
    const handleChange = (latest) => {
      if (ref.current) {
        ref.current.textContent = latest.toLocaleString(
          'en-US',
          numberFormatOptions
        );
      }
    };

    springValue.onChange(handleChange);

    return () => {
      springValue.onChange(null);
    };
  }, [springValue]);

  return <span ref={ref}>{value}</span>;
}
