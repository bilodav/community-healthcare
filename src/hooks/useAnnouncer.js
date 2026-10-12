import { useCallback, useRef, useState } from "react";

// State for the two live regions in <LiveRegions>:
//   announce(message)               -> polite (confirmations, progress)
//   announce(message, "assertive")  -> assertive (blocking problems)
//   clear()                         -> empty both regions
export function useAnnouncer() {
  const [polite, setPolite] = useState("");
  const [assertive, setAssertive] = useState("");
  const flip = useRef(false);

  const announce = useCallback((message, priority = "polite") => {
    // Setting identical text twice isn't re-announced, so alternate a
    // trailing non-breaking space to force a change in the DOM text.
    flip.current = !flip.current;
    const text = flip.current ? message : `${message}\u00A0`;

    if (priority === "assertive") {
      setAssertive(text);
      setPolite(""); // clear the other region so stale text isn't left behind
    } else {
      setPolite(text);
      setAssertive("");
    }
  }, []);

  // Empties both regions, e.g. when a focus move makes an announcement redundant
  const clear = useCallback(() => {
    setPolite("");
    setAssertive("");
  }, []);

  return { polite, assertive, announce, clear };
}
