import { useCallback, useRef, useState } from "react";
import styles from "./LiveRegions.module.css";

// Two regions, both rendered from first paint. Screen readers only announce
// *changes* inside a region that already exists, so never mount them lazily.
export function LiveRegions({ polite, assertive }) {
  return (
    <>
      {/* Confirmations and other non-urgent updates. Visible, because
          sighted users need the same confirmation. */}
      <div
        className={styles["status"]}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {polite}
      </div>

      {/* Blocking problems. Screen-reader-only: the visible error summary
          already shows this to sighted users. */}
      <div
        className="sr-only"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        {assertive}
      </div>
    </>
  );
}

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
