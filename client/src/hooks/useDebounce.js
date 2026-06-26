import { useState, useEffect } from 'react'

// This hook takes a value and a delay, and returns the updated value 
// only after the user stops typing for the specified delay.
const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cleanup function: If the user types again before the delay is over,
    // it clears the timer and restarts it.
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

export default useDebounce