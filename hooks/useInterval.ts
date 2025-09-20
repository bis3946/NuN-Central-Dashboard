
import { useEffect, useRef } from 'react';

/**
 * A custom hook for setting up an interval that can be cleared.
 * @param callback The function to be called on each interval.
 * @param delay The delay in milliseconds. Set to null to pause the interval.
 */
export const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef(callback);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
        savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};