import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    // Set initial value
    setMatches(media.matches);

    // Create event listener function
    const listener = () => setMatches(media.matches);

    // Add event listener
    media.addEventListener("change", listener);

    // Clean up
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}
