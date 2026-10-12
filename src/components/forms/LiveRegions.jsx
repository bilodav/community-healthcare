import styles from "./LiveRegions.module.css";

// Two regions, both rendered from first paint. Screen readers only announce
// *changes* inside a region that already exists, so never mount them lazily.
// State lives in the useAnnouncer hook (src/hooks/useAnnouncer.js).
function LiveRegions({ polite, assertive }) {
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

export default LiveRegions;
