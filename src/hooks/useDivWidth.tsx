"use client"
import { useRef, useState, useEffect, RefObject } from 'react';

function useDivWidth(): [RefObject<HTMLDivElement>, number | null] {
  const divRef = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;
  const [width, setWidth] = useState<number | null>(null);

  const updateWidth = () => {
    if (divRef.current) {
      setWidth(divRef.current.offsetWidth);
    }
  };

  useEffect(() => {
    updateWidth(); // Initial width check
    window.addEventListener('resize', updateWidth); // Listen for window resize
    return () => window.removeEventListener('resize', updateWidth); // Cleanup
  }, []);

  return [divRef, width];
}

export default useDivWidth;
